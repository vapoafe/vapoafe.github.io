/* --------------------------------------------------------------------------------------------------------
/* CircuitParticles.js v1.0.0 by Vasileios Apostolidis-Afentoulis.
/* Lightweight, Electronic Circuit & PCB Animation Library.
/* Includes 45° chamfered traces, microchips, pads, and signal pulses.
/* -------------------------------------------------------------------------------------------------------- */

(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        var exp = factory();
        global.CircuitParticles = exp.CircuitParticles;
        global.circuitParticlesJS = exp.circuitParticlesJS;
        global.initCircuitParticles = exp.initCircuitParticles;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    var DEFAULT_CONFIG = {
        particles: {
            number: { value: 55, density: { enable: true, value_area: 800 } },
            color: { value: ['#012169', '#0284c7', '#2563eb', '#FFC20A'] },
            shape: {
                type: ['via', 'chip', 'circle', 'resistor'],
                stroke: { width: 1.5, color: '#012169' }
            },
            opacity: {
                value: 0.85,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false }
            },
            size: {
                value: 4.5,
                random: true,
                anim: { enable: true, speed: 1.2, size_min: 2 }
            },
            move: {
                enable: true,
                speed: 1.2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'bounce'
            }
        },
        traces: {
            enable: true,
            distance: 140,
            color: '#012169',
            opacity: 0.45,
            width: 1.5,
            style: 'chamfer45',
            chamferSize: 12,
            maxConnections: 4
        },
        signals: {
            enable: true,
            speed: 3.5,
            frequency: 0.8,
            length: 18,
            size: 2.5,
            color: '#FFC20A',
            tailColor: '#012169',
            glow: 6,
            burstOnClick: true
        },
        glow: {
            enable: true,
            intensity: 6,
            color: '#012169',
            nodeGlow: true,
            traceGlow: false,
            signalGlow: true,
            compositeMode: 'source-over'
        },
        interactivity: {
            detect_on: 'window',
            events: {
                onhover: { enable: true, mode: 'probe' },
                onclick: { enable: true, mode: 'pulse-burst' },
                resize: true
            },
            modes: {
                probe: { radius: 150, traceColor: '#FFC20A', maxConnections: 4 },
                voltage_surge: { radius: 160, speedMultiplier: 2.5, sparkCount: 5 },
                breaker: { radius: 180, force: 5 },
                magnet: { radius: 160, speed: 2 },
                pulse_burst: { count: 6, speed: 5 },
                emp_blast: { radius: 220, ringSpeed: 4, disableDuration: 1500 }
            }
        },
        background: {
            color: '#ffffff',
            grid: { enable: true, type: 'dots', size: 30, opacity: 0.18, color: '#012169' },
            pcbMarks: { enable: true, labels: true, opacity: 0.25 }
        },
        retina_detect: true,
        fps_limit: 60
    };

    var CHIP_LABELS = ['IC-7404', 'MCU-32', 'ALU-8', 'CLK-64M', 'DAC-16', 'ROM-1K', 'RAM-4K', 'BUS-0', 'VCC', 'GND', 'TX', 'RX', 'PWM'];

    function deepMerge(target, source) {
        if (!source || typeof source !== 'object') return target;
        var output = Object.assign({}, target);
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    output[key] = deepMerge(target[key] || {}, source[key]);
                } else {
                    output[key] = source[key];
                }
            }
        }
        return output;
    }

    function CircuitParticles(container, userConfig) {
        this.container = typeof container === 'string' ? document.getElementById(container) : container;
        if (!this.container) {
            throw new Error('CircuitParticles: Target container element not found.');
        }

        this.config = deepMerge(DEFAULT_CONFIG, userConfig || {});
        this.nodes = [];
        this.signals = [];
        this.empWaves = [];
        this.activeTracesCount = 0;
        this.animFrameId = null;
        this.lastFrameTime = performance.now();
        this.isPlaying = true;
        this.dpr = 1;

        this.mouse = {
            x: -9999,
            y: -9999,
            isHovered: false,
            isDown: false
        };

        this.initCanvas();
        this.initEventListeners();
        this.initNodes();
        this.start();
    }

    CircuitParticles.prototype.initCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'circuit-particles-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';

        var computedPos = window.getComputedStyle(this.container).position;
        if (computedPos === 'static') {
            this.container.style.position = 'relative';
        }

        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.updateDimensions();
    };

    CircuitParticles.prototype.updateDimensions = function () {
        var rect = this.container.getBoundingClientRect();
        this.width = rect.width || window.innerWidth;
        this.height = rect.height || window.innerHeight;
        this.dpr = this.config.retina_detect ? Math.min(window.devicePixelRatio || 1, 2) : 1;

        this.canvas.width = Math.floor(this.width * this.dpr);
        this.canvas.height = Math.floor(this.height * this.dpr);
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    };

    CircuitParticles.prototype.calculateNodeCount = function () {
        var count = this.config.particles.number.value;
        if (this.config.particles.number.density.enable) {
            var area = this.width * this.height;
            var valueArea = Math.max(100, this.config.particles.number.density.value_area);
            count = Math.round((area / (valueArea * 100)) * this.config.particles.number.value);
        }
        return Math.max(10, Math.min(count, 350));
    };

    CircuitParticles.prototype.getRandomColor = function () {
        var val = this.config.particles.color.value;
        if (Array.isArray(val)) {
            return val[Math.floor(Math.random() * val.length)];
        }
        return val || '#012169';
    };

    CircuitParticles.prototype.getRandomShape = function () {
        var type = this.config.particles.shape.type;
        if (Array.isArray(type)) {
            return type[Math.floor(Math.random() * type.length)];
        }
        return type || 'via';
    };

    CircuitParticles.prototype.initNodes = function () {
        this.nodes = [];
        this.signals = [];
        this.empWaves = [];
        var targetCount = this.calculateNodeCount();

        for (var i = 0; i < targetCount; i++) {
            this.nodes.push(this.createNode(i));
        }
    };

    CircuitParticles.prototype.createNode = function (id, x, y, shapeType) {
        var speed = this.config.particles.move.speed;
        var angle = Math.random() * Math.PI * 2;
        var baseRadius = this.config.particles.size.value;
        if (this.config.particles.size.random) {
            baseRadius = 1.5 + Math.random() * (this.config.particles.size.value - 1.5);
        }

        var baseOpacity = this.config.particles.opacity.value;
        if (this.config.particles.opacity.random) {
            baseOpacity = 0.2 + Math.random() * (this.config.particles.opacity.value - 0.2);
        }

        return {
            id: id || Math.floor(Math.random() * 1000000),
            x: typeof x === 'number' ? x : Math.random() * this.width,
            y: typeof y === 'number' ? y : Math.random() * this.height,
            vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
            vy: Math.sin(angle) * speed * (0.6 + Math.random() * 0.8),
            radius: Math.max(1.5, baseRadius),
            opacity: baseOpacity,
            color: this.getRandomColor(),
            shape: shapeType || this.getRandomShape(),
            connections: [],
            label: CHIP_LABELS[Math.floor(Math.random() * CHIP_LABELS.length)],
            disabledTimer: 0,
            sparkTimer: 0
        };
    };

    CircuitParticles.prototype.initEventListeners = function () {
        var self = this;
        this.handleResize = function () {
            self.updateDimensions();
            var target = self.calculateNodeCount();
            while (self.nodes.length < target) {
                self.nodes.push(self.createNode(self.nodes.length));
            }
            if (self.nodes.length > target * 1.4) {
                self.nodes.length = target;
            }
        };
        window.addEventListener('resize', this.handleResize);

        this.handleMouseMove = function (e) {
            var rect = self.canvas.getBoundingClientRect();
            self.mouse.x = e.clientX - rect.left;
            self.mouse.y = e.clientY - rect.top;
            self.mouse.isHovered = true;
        };

        this.handleMouseLeave = function () {
            self.mouse.isHovered = false;
            self.mouse.x = -9999;
            self.mouse.y = -9999;
        };

        this.handleMouseDown = function (e) {
            var rect = self.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            self.handleClick(x, y);
        };

        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseleave', this.handleMouseLeave);
        window.addEventListener('mousedown', this.handleMouseDown);
    };

    CircuitParticles.prototype.handleClick = function (x, y) {
        var mode = this.config.interactivity.events.onclick.mode;
        if (!this.config.interactivity.events.onclick.enable) return;

        if (mode === 'pulse-burst') {
            this.emitPulse(x, y, this.config.interactivity.modes.pulse_burst.count);
        } else if (mode === 'emp-blast') {
            this.triggerEMP(x, y, this.config.interactivity.modes.emp_blast.radius);
        } else if (mode === 'add-node') {
            this.addNode(x, y);
        }
    };

    CircuitParticles.prototype.emitPulse = function (x, y, count) {
        var originX = typeof x === 'number' ? x : this.width / 2;
        var originY = typeof y === 'number' ? y : this.height / 2;
        var burstCount = count || 6;

        var nearest = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            var dist = Math.hypot(n.x - originX, n.y - originY);
            nearest.push({ node: n, dist: dist });
        }
        nearest.sort(function (a, b) { return a.dist - b.dist; });

        for (var k = 0; k < Math.min(burstCount, nearest.length); k++) {
            var src = nearest[k].node;
            if (src.connections.length > 0) {
                var tgt = src.connections[Math.floor(Math.random() * src.connections.length)];
                this.signals.push({
                    sourceId: src.id,
                    targetId: tgt.id,
                    progress: 0,
                    speed: (this.config.signals.speed * 1.5) / 100,
                    color: this.config.signals.color || '#FFC20A',
                    size: this.config.signals.size * 1.3
                });
            }
        }
    };

    CircuitParticles.prototype.triggerEMP = function (x, y, maxRad) {
        var originX = typeof x === 'number' ? x : this.width / 2;
        var originY = typeof y === 'number' ? y : this.height / 2;
        var radius = maxRad || this.config.interactivity.modes.emp_blast.radius;

        this.empWaves.push({
            x: originX,
            y: originY,
            radius: 5,
            maxRadius: radius,
            speed: this.config.interactivity.modes.emp_blast.ringSpeed,
            opacity: 0.9
        });

        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            var d = Math.hypot(n.x - originX, n.y - originY);
            if (d < radius) {
                n.disabledTimer = this.config.interactivity.modes.emp_blast.disableDuration / 16;
                n.sparkTimer = 20;
            }
        }
    };

    CircuitParticles.prototype.addNode = function (x, y, shapeType) {
        var node = this.createNode(
            this.nodes.length + 1,
            typeof x === 'number' ? x : Math.random() * this.width,
            typeof y === 'number' ? y : Math.random() * this.height,
            shapeType || 'chip'
        );
        this.nodes.push(node);
    };

    CircuitParticles.prototype.update = function (delta) {
        var i, j, node, other, dx, dy, dist;
        var moveCfg = this.config.particles.move;
        var traceDist = this.config.traces.distance;
        var maxConn = this.config.traces.maxConnections;

        for (i = 0; i < this.nodes.length; i++) {
            this.nodes[i].connections = [];
            if (this.nodes[i].disabledTimer > 0) this.nodes[i].disabledTimer--;
            if (this.nodes[i].sparkTimer > 0) this.nodes[i].sparkTimer--;
        }

        this.activeTracesCount = 0;
        for (i = 0; i < this.nodes.length; i++) {
            node = this.nodes[i];
            for (j = i + 1; j < this.nodes.length; j++) {
                other = this.nodes[j];
                if (node.connections.length >= maxConn || other.connections.length >= maxConn) continue;

                dx = other.x - node.x;
                dy = other.y - node.y;
                dist = Math.hypot(dx, dy);

                if (dist < traceDist) {
                    node.connections.push(other);
                    other.connections.push(node);
                    this.activeTracesCount++;
                }
            }
        }

        var hoverCfg = this.config.interactivity.events.onhover;
        if (hoverCfg.enable && this.mouse.isHovered) {
            var hMode = hoverCfg.mode;
            var mx = this.mouse.x;
            var my = this.mouse.y;

            for (i = 0; i < this.nodes.length; i++) {
                node = this.nodes[i];
                dx = node.x - mx;
                dy = node.y - my;
                dist = Math.hypot(dx, dy);

                if (hMode === 'probe' && dist < this.config.interactivity.modes.probe.radius) {
                    if (node.connections.length < this.config.interactivity.modes.probe.maxConnections) {
                        this.ctx.save();
                        this.ctx.strokeStyle = this.config.interactivity.modes.probe.traceColor;
                        this.ctx.lineWidth = 1.2;
                        this.ctx.setLineDash([4, 4]);
                        this.ctx.beginPath();
                        this.ctx.moveTo(mx, my);
                        this.ctx.lineTo(node.x, node.y);
                        this.ctx.stroke();
                        this.ctx.restore();
                    }
                } else if (hMode === 'breaker' && dist < this.config.interactivity.modes.breaker.radius && dist > 1) {
                    var push = (1 - dist / this.config.interactivity.modes.breaker.radius) * this.config.interactivity.modes.breaker.force;
                    node.x += (dx / dist) * push;
                    node.y += (dy / dist) * push;
                } else if (hMode === 'magnet' && dist < this.config.interactivity.modes.magnet.radius && dist > 1) {
                    var pull = (1 - dist / this.config.interactivity.modes.magnet.radius) * this.config.interactivity.modes.magnet.speed;
                    node.x -= (dx / dist) * pull;
                    node.y -= (dy / dist) * pull;
                }
            }
        }

        if (moveCfg.enable) {
            for (i = 0; i < this.nodes.length; i++) {
                node = this.nodes[i];
                if (node.disabledTimer > 0) continue;

                node.x += node.vx;
                node.y += node.vy;

                if (moveCfg.out_mode === 'bounce') {
                    if (node.x <= node.radius) {
                        node.x = node.radius;
                        node.vx *= -1;
                    } else if (node.x >= this.width - node.radius) {
                        node.x = this.width - node.radius;
                        node.vx *= -1;
                    }
                    if (node.y <= node.radius) {
                        node.y = node.radius;
                        node.vy *= -1;
                    } else if (node.y >= this.height - node.radius) {
                        node.y = this.height - node.radius;
                        node.vy *= -1;
                    }
                } else {
                    if (node.x < -20) node.x = this.width + 20;
                    if (node.x > this.width + 20) node.x = -20;
                    if (node.y < -20) node.y = this.height + 20;
                    if (node.y > this.height + 20) node.y = -20;
                }
            }
        }

        if (this.config.signals.enable && Math.random() < this.config.signals.frequency * 0.15) {
            if (this.nodes.length > 0) {
                var randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                if (randomNode.connections.length > 0 && randomNode.disabledTimer === 0) {
                    var targetNode = randomNode.connections[Math.floor(Math.random() * randomNode.connections.length)];
                    this.signals.push({
                        sourceId: randomNode.id,
                        targetId: targetNode.id,
                        progress: 0,
                        speed: this.config.signals.speed / 100,
                        color: this.config.signals.color || '#FFC20A',
                        size: this.config.signals.size
                    });
                }
            }
        }

        for (i = this.signals.length - 1; i >= 0; i--) {
            var sig = this.signals[i];
            sig.progress += sig.speed;
            if (sig.progress >= 1) {
                this.signals.splice(i, 1);
            }
        }

        for (i = this.empWaves.length - 1; i >= 0; i--) {
            var wave = this.empWaves[i];
            wave.radius += wave.speed;
            wave.opacity = Math.max(0, 1 - wave.radius / wave.maxRadius);
            if (wave.radius >= wave.maxRadius) {
                this.empWaves.splice(i, 1);
            }
        }
    };

    CircuitParticles.prototype.drawBackground = function () {
        var bg = this.config.background;
        this.ctx.fillStyle = bg.color || '#ffffff';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (!bg.grid || !bg.grid.enable) return;

        this.ctx.save();
        this.ctx.fillStyle = bg.grid.color || '#012169';
        this.ctx.strokeStyle = bg.grid.color || '#012169';
        this.ctx.globalAlpha = bg.grid.opacity || 0.15;

        var step = bg.grid.size || 30;
        var x, y;

        if (bg.grid.type === 'dots') {
            for (x = step / 2; x < this.width; x += step) {
                for (y = step / 2; y < this.height; y += step) {
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 1, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        } else if (bg.grid.type === 'lines') {
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            for (x = 0; x < this.width; x += step) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
            }
            for (y = 0; y < this.height; y += step) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
            }
            this.ctx.stroke();
        }
        this.ctx.restore();
    };

    CircuitParticles.prototype.drawChamferTrace = function (x1, y1, x2, y2, chamfer) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        var absDx = Math.abs(dx);
        var absDy = Math.abs(dy);
        var c = Math.min(chamfer, absDx / 2, absDy / 2);

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);

        if (absDx > absDy) {
            var midX = x1 + (dx > 0 ? absDx - absDy : -(absDx - absDy));
            this.ctx.lineTo(midX - (dx > 0 ? c : -c), y1);
            this.ctx.lineTo(x2, y2);
        } else {
            var midY = y1 + (dy > 0 ? absDy - absDx : -(absDy - absDx));
            this.ctx.lineTo(x1, midY - (dy > 0 ? c : -c));
            this.ctx.lineTo(x2, y2);
        }
        this.ctx.stroke();
    };

    CircuitParticles.prototype.drawTraces = function () {
        if (!this.config.traces.enable) return;

        var style = this.config.traces.style || 'chamfer45';
        var chamfer = this.config.traces.chamferSize || 12;

        this.ctx.save();
        this.ctx.strokeStyle = this.config.traces.color || '#012169';
        this.ctx.lineWidth = this.config.traces.width || 1.5;
        this.ctx.globalAlpha = this.config.traces.opacity || 0.45;

        var visited = {};
        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            for (var j = 0; j < node.connections.length; j++) {
                var other = node.connections[j];
                var pairKey = node.id < other.id ? node.id + '_' + other.id : other.id + '_' + node.id;
                if (visited[pairKey]) continue;
                visited[pairKey] = true;

                if (style === 'chamfer45') {
                    this.drawChamferTrace(node.x, node.y, other.x, other.y, chamfer);
                } else if (style === 'orthogonal90') {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(other.x, node.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                } else {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.restore();
    };

    CircuitParticles.prototype.drawNode = function (node) {
        this.ctx.save();
        this.ctx.translate(node.x, node.y);
        this.ctx.globalAlpha = node.opacity;

        var r = node.radius;
        var isChip = node.shape === 'chip';
        var isVia = node.shape === 'via';
        var isResistor = node.shape === 'resistor';

        if (isChip) {
            var sz = r * 2.4;
            this.ctx.fillStyle = '#0f172a';
            this.ctx.fillRect(-sz / 2, -sz / 2, sz, sz);

            this.ctx.strokeStyle = node.color;
            this.ctx.lineWidth = 1.2;
            this.ctx.strokeRect(-sz / 2, -sz / 2, sz, sz);

            this.ctx.fillStyle = '#cbd5e1';
            var pinLen = 2.5;
            this.ctx.fillRect(-sz / 2 - pinLen, -sz / 4, pinLen, sz / 2);
            this.ctx.fillRect(sz / 2, -sz / 4, pinLen, sz / 2);

            this.ctx.fillStyle = '#FFC20A';
            this.ctx.beginPath();
            this.ctx.arc(-sz / 2 + 2.5, -sz / 2 + 2.5, 1, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (isVia) {
            this.ctx.fillStyle = node.color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, r, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = this.config.background.color || '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (isResistor) {
            var w = r * 2.2;
            var h = r * 1.3;
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(-w / 2, -h / 2, w, h);
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.fillRect(-w / 2, -h / 2, w * 0.25, h);
            this.ctx.fillRect(w / 2 - w * 0.25, -h / 2, w * 0.25, h);
        } else {
            this.ctx.fillStyle = node.color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, r, 0, Math.PI * 2);
            this.ctx.fill();
        }

        if (node.sparkTimer > 0) {
            this.ctx.strokeStyle = '#ef4444';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        this.ctx.restore();
    };

    CircuitParticles.prototype.drawSignals = function () {
        if (!this.config.signals.enable || this.signals.length === 0) return;

        var nodeMap = {};
        for (var i = 0; i < this.nodes.length; i++) {
            nodeMap[this.nodes[i].id] = this.nodes[i];
        }

        this.ctx.save();
        for (var k = 0; k < this.signals.length; k++) {
            var sig = this.signals[k];
            var src = nodeMap[sig.sourceId];
            var tgt = nodeMap[sig.targetId];
            if (!src || !tgt) continue;

            var px = src.x + (tgt.x - src.x) * sig.progress;
            var py = src.y + (tgt.y - src.y) * sig.progress;

            this.ctx.fillStyle = sig.color || '#FFC20A';
            this.ctx.beginPath();
            this.ctx.arc(px, py, sig.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    };

    CircuitParticles.prototype.drawEMPWaves = function () {
        if (this.empWaves.length === 0) return;

        this.ctx.save();
        for (var i = 0; i < this.empWaves.length; i++) {
            var w = this.empWaves[i];
            this.ctx.strokeStyle = 'rgba(56, 189, 248, ' + w.opacity + ')';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        this.ctx.restore();
    };

    CircuitParticles.prototype.render = function () {
        this.drawBackground();
        this.drawTraces();
        this.drawSignals();

        for (var i = 0; i < this.nodes.length; i++) {
            this.drawNode(this.nodes[i]);
        }

        this.drawEMPWaves();
    };

    CircuitParticles.prototype.start = function () {
        var self = this;
        function loop(time) {
            var delta = (time - self.lastFrameTime) / 1000;
            self.lastFrameTime = time;

            if (self.isPlaying) {
                self.update(delta);
                self.render();
            }

            self.animFrameId = requestAnimationFrame(loop);
        }
        this.animFrameId = requestAnimationFrame(loop);
    };

    CircuitParticles.prototype.destroy = function () {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseleave', this.handleMouseLeave);
        window.removeEventListener('mousedown', this.handleMouseDown);

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    };

    function circuitParticlesJS(tag_id, params) {
        return new CircuitParticles(tag_id, params);
    }

    function initCircuitParticles(tag_id, params) {
        return new CircuitParticles(tag_id, params);
    }

    return {
        CircuitParticles: CircuitParticles,
        circuitParticlesJS: circuitParticlesJS,
        initCircuitParticles: initCircuitParticles
    };
});