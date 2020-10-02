
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const page = writable( 'baja' );

    /* src/components/navbar.svelte generated by Svelte v3.29.0 */

    const { console: console_1 } = globals;
    const file = "src/components/navbar.svelte";

    function create_fragment(ctx) {
    	let header;
    	let a0;
    	let t1;
    	let input;
    	let t2;
    	let label;
    	let span;
    	let t3;
    	let ul;
    	let li0;
    	let a1;
    	let t5;
    	let li1;
    	let a2;
    	let t7;
    	let li2;
    	let a3;
    	let t9;
    	let li3;
    	let a4;
    	let t11;
    	let li4;
    	let a5;
    	let t13;
    	let li5;
    	let a6;
    	let t15;
    	let li6;
    	let a7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			a0 = element("a");
    			a0.textContent = "SAE";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			label = element("label");
    			span = element("span");
    			t3 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Home";
    			t5 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Baja";
    			t7 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Supra";
    			t9 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Aero";
    			t11 = space();
    			li4 = element("li");
    			a5 = element("a");
    			a5.textContent = "Sponsor";
    			t13 = space();
    			li5 = element("li");
    			a6 = element("a");
    			a6.textContent = "Alumini";
    			t15 = space();
    			li6 = element("li");
    			a7 = element("a");
    			a7.textContent = "Contact";
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "logo svelte-7tuiig");
    			add_location(a0, file, 85, 6, 2271);
    			attr_dev(input, "class", "menu-btn svelte-7tuiig");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "menu-btn");
    			add_location(input, file, 86, 6, 2310);
    			attr_dev(span, "class", "navicon svelte-7tuiig");
    			add_location(span, file, 87, 46, 2413);
    			attr_dev(label, "class", "menu-icon svelte-7tuiig");
    			attr_dev(label, "for", "menu-btn");
    			add_location(label, file, 87, 6, 2373);
    			attr_dev(a1, "href", "#docTop");
    			attr_dev(a1, "class", "svelte-7tuiig");
    			add_location(a1, file, 89, 43, 2513);
    			attr_dev(li0, "id", "home");
    			attr_dev(li0, "class", "svelte-7tuiig");
    			add_location(li0, file, 89, 12, 2482);
    			attr_dev(a2, "href", "#docTop");
    			attr_dev(a2, "class", "svelte-7tuiig");
    			add_location(a2, file, 90, 43, 2588);
    			attr_dev(li1, "id", "baja");
    			attr_dev(li1, "class", "svelte-7tuiig");
    			add_location(li1, file, 90, 12, 2557);
    			attr_dev(a3, "href", "#docTop");
    			attr_dev(a3, "class", "svelte-7tuiig");
    			add_location(a3, file, 91, 44, 2664);
    			attr_dev(li2, "id", "supra");
    			attr_dev(li2, "class", "svelte-7tuiig");
    			add_location(li2, file, 91, 12, 2632);
    			attr_dev(a4, "href", "#docTop");
    			attr_dev(a4, "class", "svelte-7tuiig");
    			add_location(a4, file, 92, 43, 2740);
    			attr_dev(li3, "id", "aero");
    			attr_dev(li3, "class", "svelte-7tuiig");
    			add_location(li3, file, 92, 12, 2709);
    			attr_dev(a5, "href", "#docTop");
    			attr_dev(a5, "class", "svelte-7tuiig");
    			add_location(a5, file, 93, 44, 2816);
    			attr_dev(li4, "id", "spons");
    			attr_dev(li4, "class", "svelte-7tuiig");
    			add_location(li4, file, 93, 12, 2784);
    			attr_dev(a6, "href", "#docTop");
    			attr_dev(a6, "class", "svelte-7tuiig");
    			add_location(a6, file, 94, 43, 2894);
    			attr_dev(li5, "id", "alum");
    			attr_dev(li5, "class", "svelte-7tuiig");
    			add_location(li5, file, 94, 12, 2863);
    			attr_dev(a7, "href", "#docTop");
    			attr_dev(a7, "class", "svelte-7tuiig");
    			add_location(a7, file, 95, 46, 2975);
    			attr_dev(li6, "id", "contact");
    			attr_dev(li6, "class", "svelte-7tuiig");
    			add_location(li6, file, 95, 12, 2941);
    			attr_dev(ul, "class", "menu svelte-7tuiig");
    			add_location(ul, file, 88, 6, 2452);
    			attr_dev(header, "id", "purecss_header");
    			attr_dev(header, "class", "header svelte-7tuiig");
    			add_location(header, file, 84, 0, 2221);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, a0);
    			append_dev(header, t1);
    			append_dev(header, input);
    			append_dev(header, t2);
    			append_dev(header, label);
    			append_dev(label, span);
    			append_dev(header, t3);
    			append_dev(header, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(ul, t11);
    			append_dev(ul, li4);
    			append_dev(li4, a5);
    			append_dev(ul, t13);
    			append_dev(ul, li5);
    			append_dev(li5, a6);
    			append_dev(ul, t15);
    			append_dev(ul, li6);
    			append_dev(li6, a7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li0, "click", /*chTab*/ ctx[0], false, false, false),
    					listen_dev(li1, "click", /*chTab*/ ctx[0], false, false, false),
    					listen_dev(li2, "click", /*chTab*/ ctx[0], false, false, false),
    					listen_dev(li3, "click", /*chTab*/ ctx[0], false, false, false),
    					listen_dev(li4, "click", /*chTab*/ ctx[0], false, false, false),
    					listen_dev(li5, "click", /*chTab*/ ctx[0], false, false, false),
    					listen_dev(li6, "click", /*chTab*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $page;
    	validate_store(page, "page");
    	component_subscribe($$self, page, $$value => $$invalidate(1, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, []);

    	const chTab = e => {
    		page.set(e.target.parentElement.id);
    		console.log($page);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ page, chTab, $page });
    	return [chTab];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/components/home.svelte generated by Svelte v3.29.0 */

    const file$1 = "src/components/home.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let video;
    	let track;
    	let video_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			video = element("video");
    			track = element("track");
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$1, 9, 12, 111);
    			if (video.src !== (video_src_value = /*link*/ ctx[0])) attr_dev(video, "src", video_src_value);
    			add_location(video, file$1, 8, 6, 80);
    			attr_dev(div, "class", "video");
    			add_location(div, file$1, 7, 0, 54);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, video);
    			append_dev(video, track);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	let link;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ link });

    	$$self.$inject_state = $$props => {
    		if ("link" in $$props) $$invalidate(0, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [link];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* node_modules/.pnpm/svelte-lazy@1.0.7_svelte@3.29.0/node_modules/svelte-lazy/src/components/Placeholder.svelte generated by Svelte v3.29.0 */

    const file$2 = "node_modules/.pnpm/svelte-lazy@1.0.7_svelte@3.29.0/node_modules/svelte-lazy/src/components/Placeholder.svelte";

    // (4:46) 
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*placeholder*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*placeholder*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(4:46) ",
    		ctx
    	});

    	return block;
    }

    // (2:2) {#if typeof placeholder === 'string'}
    function create_if_block(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*placeholder*/ ctx[0]);
    			add_location(div, file$2, 2, 4, 75);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 1) set_data_dev(t, /*placeholder*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(2:2) {#if typeof placeholder === 'string'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (typeof /*placeholder*/ ctx[0] === "string") return 0;
    		if (typeof /*placeholder*/ ctx[0] === "function") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", placeholderClass);
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const placeholderClass = "svelte-lazy-placeholder";

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Placeholder", slots, []);
    	let { placeholder = null } = $$props;
    	const writable_props = ["placeholder"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Placeholder> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    	};

    	$$self.$capture_state = () => ({ placeholder, placeholderClass });

    	$$self.$inject_state = $$props => {
    		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [placeholder];
    }

    class Placeholder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { placeholder: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Placeholder",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get placeholder() {
    		throw new Error("<Placeholder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Placeholder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/.pnpm/svelte-lazy@1.0.7_svelte@3.29.0/node_modules/svelte-lazy/src/index.svelte generated by Svelte v3.29.0 */
    const file$3 = "node_modules/.pnpm/svelte-lazy@1.0.7_svelte@3.29.0/node_modules/svelte-lazy/src/index.svelte";

    // (13:2) {:else}
    function create_else_block(ctx) {
    	let placeholder_1;
    	let current;

    	placeholder_1 = new Placeholder({
    			props: { placeholder: /*placeholder*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(placeholder_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(placeholder_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const placeholder_1_changes = {};
    			if (dirty & /*placeholder*/ 2) placeholder_1_changes.placeholder = /*placeholder*/ ctx[1];
    			placeholder_1.$set(placeholder_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(placeholder_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(placeholder_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(placeholder_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(13:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (2:2) {#if loaded}
    function create_if_block$1(ctx) {
    	let div;
    	let div_intro;
    	let t;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);
    	let if_block = /*contentDisplay*/ ctx[3] === "hide" && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", contentClass);
    			attr_dev(div, "style", /*contentStyle*/ ctx[4]);
    			add_location(div, file$3, 2, 4, 54);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*contentStyle*/ 16) {
    				attr_dev(div, "style", /*contentStyle*/ ctx[4]);
    			}

    			if (/*contentDisplay*/ ctx[3] === "hide") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*contentDisplay*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, /*fadeOption*/ ctx[0] || {});
    					div_intro.start();
    				});
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(2:2) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (8:12) Lazy load content
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lazy load content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(8:12) Lazy load content",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#if contentDisplay === 'hide'}
    function create_if_block_1$1(ctx) {
    	let placeholder_1;
    	let current;

    	placeholder_1 = new Placeholder({
    			props: { placeholder: /*placeholder*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(placeholder_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(placeholder_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const placeholder_1_changes = {};
    			if (dirty & /*placeholder*/ 2) placeholder_1_changes.placeholder = /*placeholder*/ ctx[1];
    			placeholder_1.$set(placeholder_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(placeholder_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(placeholder_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(placeholder_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(10:4) {#if contentDisplay === 'hide'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let load_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", /*rootClass*/ ctx[5]);
    			add_location(div, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(load_action = /*load*/ ctx[6].call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const contentClass = "svelte-lazy-content";

    function getContainerHeight(e) {
    	if (e && e.target && e.target.getBoundingClientRect) {
    		return e.target.getBoundingClientRect().bottom;
    	} else {
    		return window.innerHeight;
    	}
    }

    // From underscore souce code
    function throttle(func, wait, options) {
    	let context, args, result;
    	let timeout = null;
    	let previous = 0;
    	if (!options) options = {};

    	const later = function () {
    		previous = options.leading === false ? 0 : new Date();
    		timeout = null;
    		result = func.apply(context, args);
    		if (!timeout) context = args = null;
    	};

    	return function (event) {
    		const now = new Date();
    		if (!previous && options.leading === false) previous = now;
    		const remaining = wait - (now - previous);
    		context = this;
    		args = arguments;

    		if (remaining <= 0 || remaining > wait) {
    			if (timeout) {
    				clearTimeout(timeout);
    				timeout = null;
    			}

    			previous = now;
    			result = func.apply(context, args);
    			if (!timeout) context = args = null;
    		} else if (!timeout && options.trailing !== false) {
    			timeout = setTimeout(later, remaining);
    		}

    		return result;
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Src", slots, ['default']);
    	let { height = 0 } = $$props;
    	let { offset = 150 } = $$props;
    	let { fadeOption = { delay: 0, duration: 400 } } = $$props;
    	let { resetHeightDelay = 0 } = $$props;
    	let { onload = null } = $$props;
    	let { placeholder = null } = $$props;
    	let { class: className = "" } = $$props;
    	const rootClass = "svelte-lazy" + (className ? " " + className : "");
    	let loaded = false;
    	let contentDisplay = "";

    	function load(node) {
    		setHeight(node);

    		const loadHandler = throttle(
    			e => {
    				const nodeTop = node.getBoundingClientRect().top;
    				const expectedTop = getContainerHeight(e) + offset;

    				if (nodeTop <= expectedTop) {
    					$$invalidate(2, loaded = true);
    					resetHeight(node);
    					onload && onload(node);
    					removeListeners();
    				}
    			},
    			200
    		);

    		loadHandler();
    		addListeners();

    		function addListeners() {
    			document.addEventListener("scroll", loadHandler, true);
    			window.addEventListener("resize", loadHandler);
    		}

    		function removeListeners() {
    			document.removeEventListener("scroll", loadHandler, true);
    			window.removeEventListener("resize", loadHandler);
    		}

    		return {
    			destroy: () => {
    				removeListeners();
    			}
    		};
    	}

    	function setHeight(node) {
    		if (height) {
    			node.style.height = typeof height === "number" ? height + "px" : height;
    		}
    	}

    	function resetHeight(node) {
    		// Add delay for remote resources like images to load
    		setTimeout(
    			() => {
    				const handled = handleImgContent(node);

    				if (!handled) {
    					node.style.height = "auto";
    				}
    			},
    			resetHeightDelay
    		);
    	}

    	function handleImgContent(node) {
    		const img = node.querySelector("img");

    		if (img) {
    			if (!img.complete) {
    				$$invalidate(3, contentDisplay = "hide");

    				node.addEventListener(
    					"load",
    					() => {
    						$$invalidate(3, contentDisplay = "");
    						node.style.height = "auto";
    					},
    					{ capture: true, once: true }
    				);

    				node.addEventListener(
    					"error",
    					() => {
    						// Keep passed height if there is error
    						$$invalidate(3, contentDisplay = "");
    					},
    					{ capture: true, once: true }
    				);

    				return true;
    			} else if (img.naturalHeight === 0) {
    				// Keep passed height if img has zero height
    				return true;
    			}
    		}
    	}

    	const writable_props = [
    		"height",
    		"offset",
    		"fadeOption",
    		"resetHeightDelay",
    		"onload",
    		"placeholder",
    		"class"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Src> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("height" in $$props) $$invalidate(7, height = $$props.height);
    		if ("offset" in $$props) $$invalidate(8, offset = $$props.offset);
    		if ("fadeOption" in $$props) $$invalidate(0, fadeOption = $$props.fadeOption);
    		if ("resetHeightDelay" in $$props) $$invalidate(9, resetHeightDelay = $$props.resetHeightDelay);
    		if ("onload" in $$props) $$invalidate(10, onload = $$props.onload);
    		if ("placeholder" in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ("class" in $$props) $$invalidate(11, className = $$props.class);
    		if ("$$scope" in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		Placeholder,
    		height,
    		offset,
    		fadeOption,
    		resetHeightDelay,
    		onload,
    		placeholder,
    		className,
    		rootClass,
    		contentClass,
    		loaded,
    		contentDisplay,
    		load,
    		setHeight,
    		resetHeight,
    		handleImgContent,
    		getContainerHeight,
    		throttle,
    		contentStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ("height" in $$props) $$invalidate(7, height = $$props.height);
    		if ("offset" in $$props) $$invalidate(8, offset = $$props.offset);
    		if ("fadeOption" in $$props) $$invalidate(0, fadeOption = $$props.fadeOption);
    		if ("resetHeightDelay" in $$props) $$invalidate(9, resetHeightDelay = $$props.resetHeightDelay);
    		if ("onload" in $$props) $$invalidate(10, onload = $$props.onload);
    		if ("placeholder" in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ("className" in $$props) $$invalidate(11, className = $$props.className);
    		if ("loaded" in $$props) $$invalidate(2, loaded = $$props.loaded);
    		if ("contentDisplay" in $$props) $$invalidate(3, contentDisplay = $$props.contentDisplay);
    		if ("contentStyle" in $$props) $$invalidate(4, contentStyle = $$props.contentStyle);
    	};

    	let contentStyle;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*contentDisplay*/ 8) {
    			 $$invalidate(4, contentStyle = contentDisplay === "hide" ? "display: none" : "");
    		}
    	};

    	return [
    		fadeOption,
    		placeholder,
    		loaded,
    		contentDisplay,
    		contentStyle,
    		rootClass,
    		load,
    		height,
    		offset,
    		resetHeightDelay,
    		onload,
    		className,
    		$$scope,
    		slots
    	];
    }

    class Src extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			height: 7,
    			offset: 8,
    			fadeOption: 0,
    			resetHeightDelay: 9,
    			onload: 10,
    			placeholder: 1,
    			class: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get height() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fadeOption() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fadeOption(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetHeightDelay() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resetHeightDelay(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onload() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onload(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/baja.svelte generated by Svelte v3.29.0 */
    const file$4 = "src/components/baja.svelte";

    // (80:18) <Lazy                         offset={100}                         fadeOption={{ delay: 0, duration: 500 }}                         height={300}>
    function create_default_slot_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/29088313_152208615475047_8892872332037586944_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=208asltyTuQAX9rfILr&oh=3d359835c4ce849cc055e057aff5e185&oe=5FA22B52")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1794sni");
    			add_location(img, file$4, 83, 24, 3072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(80:18) <Lazy                         offset={100}                         fadeOption={{ delay: 0, duration: 500 }}                         height={300}>",
    		ctx
    	});

    	return block;
    }

    // (92:18) <Lazy                         offset={100}                         fadeOption={{ delay: 0, duration: 500 }}                         height={300}>
    function create_default_slot_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/29088313_152208615475047_8892872332037586944_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=208asltyTuQAX9rfILr&oh=3d359835c4ce849cc055e057aff5e185&oe=5FA22B52")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1794sni");
    			add_location(img, file$4, 95, 24, 3753);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(92:18) <Lazy                         offset={100}                         fadeOption={{ delay: 0, duration: 500 }}                         height={300}>",
    		ctx
    	});

    	return block;
    }

    // (104:18) <Lazy                         offset={100}                         fadeOption={{ delay: 0, duration: 500 }}                         height={300}>
    function create_default_slot(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/29088313_152208615475047_8892872332037586944_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=208asltyTuQAX9rfILr&oh=3d359835c4ce849cc055e057aff5e185&oe=5FA22B52")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1794sni");
    			add_location(img, file$4, 107, 24, 4434);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(104:18) <Lazy                         offset={100}                         fadeOption={{ delay: 0, duration: 500 }}                         height={300}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let t0;
    	let br0;
    	let t1;
    	let hr0;
    	let t2;
    	let div0;
    	let button;
    	let span0;
    	let i;
    	let t4;
    	let svg;
    	let path;
    	let t5;
    	let br1;
    	let t6;
    	let div4;
    	let div1;
    	let lazy0;
    	let t7;
    	let br2;
    	let t8;
    	let span1;
    	let t10;
    	let div2;
    	let lazy1;
    	let t11;
    	let br3;
    	let t12;
    	let span2;
    	let t14;
    	let div3;
    	let lazy2;
    	let t15;
    	let br4;
    	let t16;
    	let span3;
    	let t18;
    	let div5;
    	let h1;
    	let t19;
    	let img;
    	let img_src_value;
    	let t20;
    	let p;
    	let t22;
    	let hr1;
    	let t23;
    	let current;

    	lazy0 = new Src({
    			props: {
    				offset: 100,
    				fadeOption: { delay: 0, duration: 500 },
    				height: 300,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	lazy1 = new Src({
    			props: {
    				offset: 100,
    				fadeOption: { delay: 0, duration: 500 },
    				height: 300,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	lazy2 = new Src({
    			props: {
    				offset: 100,
    				fadeOption: { delay: 0, duration: 500 },
    				height: 300,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			t0 = text("bg img\n      ");
    			br0 = element("br");
    			t1 = text("\n      specs\n      ");
    			hr0 = element("hr");
    			t2 = space();
    			div0 = element("div");
    			button = element("button");
    			span0 = element("span");
    			i = element("i");
    			i.textContent = "Sponsor Us";
    			t4 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			div4 = element("div");
    			div1 = element("div");
    			create_component(lazy0.$$.fragment);
    			t7 = space();
    			br2 = element("br");
    			t8 = space();
    			span1 = element("span");
    			span1.textContent = "Baja 2017";
    			t10 = space();
    			div2 = element("div");
    			create_component(lazy1.$$.fragment);
    			t11 = space();
    			br3 = element("br");
    			t12 = space();
    			span2 = element("span");
    			span2.textContent = "Baja 2018";
    			t14 = space();
    			div3 = element("div");
    			create_component(lazy2.$$.fragment);
    			t15 = space();
    			br4 = element("br");
    			t16 = space();
    			span3 = element("span");
    			span3.textContent = "Baja 2019";
    			t18 = space();
    			div5 = element("div");
    			h1 = element("h1");
    			t19 = text("About the Baja\n                  ");
    			img = element("img");
    			t20 = space();
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n                  Fugiat velit molestiae dolorem officiis ducimus beatae cum\n                  ipsa et sint. Voluptas ipsum dolore repellat dignissimos\n                  ratione dolor earum quisquam perspiciatis hic. Lorem ipsum\n                  dolor sit amet consectetur adipisicing elit. Quo laborum\n                  exercitationem id voluptas expedita necessitatibus maxime\n                  distinctio illo deserunt? Accusamus laudantium placeat,\n                  repudiandae atque voluptas adipisci temporibus aspernatur\n                  excepturi reiciendis.";
    			t22 = text("\n      subsystems\n      ");
    			hr1 = element("hr");
    			t23 = text("\n      team photo");
    			add_location(br0, file$4, 54, 6, 996);
    			add_location(hr0, file$4, 56, 6, 1021);
    			add_location(i, file$4, 60, 24, 1224);
    			set_style(span0, "font-size", "4em");
    			set_style(span0, "font-weight", "200");
    			set_style(span0, "padding", "0 0.15em");
    			add_location(span0, file$4, 59, 18, 1137);
    			attr_dev(path, "stroke", "#fff");
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "stroke-width", "150");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "d", "M2238 210C2135 107 1968 112 1865 215 1762 318 1762 485 1865 588L2127 849C2230 952 2397 948 2500 845 2603 742 2603 575 2500 472ZM1862 587C1759 484 1592 488 1489 591 1386 694 1386 861 1489 964L1750 1226C1853 1329 2020 1324 2123 1221 2226 1118 2226 951 2123 848ZM1485 963C1382 860 1215 865 1112 968 1009 1071 1009 1238 1112 1341L1374 1602C1477 1705 1644 1701 1747 1598 1850 1495 1850 1328 1747 1225ZM1109 1340C1006 1237 839 1241 736 1344 633 1447 633 1614 736 1717L997 1979C1100 2082 1267 2077 1370 1974 1473 1871 1473 1704 1370 1601ZM2539 3059L2088 2608C1869 2385 1525 2385 1313 2597L2078 3362M2076 3360C2533 3818 3339 3882 3796 3424 4253 2967 4253 2225 3796 1768M2547 3055L3703 1899C3806 1796 3801 1629 3698 1526 3595 1423 3428 1423 3325 1526M2548 2301L3326 1522C3429 1419 3425 1252 3322 1149 3219 1046 3052 1046 2949 1149L2170 1928M2950 1146C3053 1043 3048 876 2945 773 2842 670 2675 670 2572 773M617 1672L512 1777C54 2235-10 3040 448 3498 905 3955 1647 3955 2104 3498L2136 3465");
    			add_location(path, file$4, 67, 24, 1542);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "50");
    			attr_dev(svg, "height", "50");
    			attr_dev(svg, "viewBox", "0 0 4274 3976");
    			set_style(svg, "transform", "scaleY(-1) skewX(0deg)");
    			attr_dev(svg, "class", "svelte-1794sni");
    			add_location(svg, file$4, 61, 18, 1269);
    			attr_dev(button, "class", "sponsor-btn svelte-1794sni");
    			add_location(button, file$4, 58, 12, 1090);
    			set_style(div0, "width", "100%");
    			set_style(div0, "text-align", "center");
    			add_location(div0, file$4, 57, 6, 1034);
    			add_location(br1, file$4, 76, 6, 2818);
    			add_location(br2, file$4, 87, 18, 3449);
    			set_style(span1, "color", "#ccc");
    			add_location(span1, file$4, 88, 18, 3474);
    			attr_dev(div1, "class", "car svelte-1794sni");
    			add_location(div1, file$4, 78, 12, 2866);
    			add_location(br3, file$4, 99, 18, 4130);
    			set_style(span2, "color", "#ddd");
    			add_location(span2, file$4, 100, 18, 4155);
    			attr_dev(div2, "class", "car svelte-1794sni");
    			add_location(div2, file$4, 90, 12, 3547);
    			add_location(br4, file$4, 111, 18, 4811);
    			set_style(span3, "color", "#eee");
    			add_location(span3, file$4, 112, 18, 4836);
    			attr_dev(div3, "class", "car svelte-1794sni");
    			add_location(div3, file$4, 102, 12, 4228);
    			attr_dev(div4, "class", "oldModel svelte-1794sni");
    			add_location(div4, file$4, 77, 6, 2831);
    			if (img.src !== (img_src_value = "./assets/cars/cybertruck.png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "transform", "scaleX(-1)");
    			set_style(img, "height", "1.5em");
    			set_style(img, "position", "relative");
    			set_style(img, "top", "0.5em");
    			set_style(img, "filter", "saturate(0) contrast(100%) brightness(30)");
    			attr_dev(img, "alt", "");
    			add_location(img, file$4, 118, 18, 5004);
    			add_location(h1, file$4, 116, 12, 4948);
    			add_location(p, file$4, 124, 12, 5278);
    			attr_dev(div5, "class", "about svelte-1794sni");
    			add_location(div5, file$4, 115, 6, 4916);
    			add_location(hr1, file$4, 137, 6, 5981);
    			attr_dev(section, "class", "svelte-1794sni");
    			add_location(section, file$4, 52, 0, 967);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, t0);
    			append_dev(section, br0);
    			append_dev(section, t1);
    			append_dev(section, hr0);
    			append_dev(section, t2);
    			append_dev(section, div0);
    			append_dev(div0, button);
    			append_dev(button, span0);
    			append_dev(span0, i);
    			append_dev(button, t4);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(section, t5);
    			append_dev(section, br1);
    			append_dev(section, t6);
    			append_dev(section, div4);
    			append_dev(div4, div1);
    			mount_component(lazy0, div1, null);
    			append_dev(div1, t7);
    			append_dev(div1, br2);
    			append_dev(div1, t8);
    			append_dev(div1, span1);
    			append_dev(div4, t10);
    			append_dev(div4, div2);
    			mount_component(lazy1, div2, null);
    			append_dev(div2, t11);
    			append_dev(div2, br3);
    			append_dev(div2, t12);
    			append_dev(div2, span2);
    			append_dev(div4, t14);
    			append_dev(div4, div3);
    			mount_component(lazy2, div3, null);
    			append_dev(div3, t15);
    			append_dev(div3, br4);
    			append_dev(div3, t16);
    			append_dev(div3, span3);
    			append_dev(section, t18);
    			append_dev(section, div5);
    			append_dev(div5, h1);
    			append_dev(h1, t19);
    			append_dev(h1, img);
    			append_dev(div5, t20);
    			append_dev(div5, p);
    			append_dev(section, t22);
    			append_dev(section, hr1);
    			append_dev(section, t23);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const lazy0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				lazy0_changes.$$scope = { dirty, ctx };
    			}

    			lazy0.$set(lazy0_changes);
    			const lazy1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				lazy1_changes.$$scope = { dirty, ctx };
    			}

    			lazy1.$set(lazy1_changes);
    			const lazy2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				lazy2_changes.$$scope = { dirty, ctx };
    			}

    			lazy2.$set(lazy2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lazy0.$$.fragment, local);
    			transition_in(lazy1.$$.fragment, local);
    			transition_in(lazy2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lazy0.$$.fragment, local);
    			transition_out(lazy1.$$.fragment, local);
    			transition_out(lazy2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(lazy0);
    			destroy_component(lazy1);
    			destroy_component(lazy2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Baja", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Baja> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Lazy: Src });
    	return [];
    }

    class Baja extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Baja",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/supra.svelte generated by Svelte v3.29.0 */

    function create_fragment$5(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Supra", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Supra> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Supra extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Supra",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/aero.svelte generated by Svelte v3.29.0 */

    function create_fragment$6(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Aero", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Aero> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Aero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Aero",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/alum.svelte generated by Svelte v3.29.0 */

    function create_fragment$7(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Alum", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Alum> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Alum extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alum",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/spons.svelte generated by Svelte v3.29.0 */

    function create_fragment$8(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Spons", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Spons> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Spons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spons",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/micro/folderview.svelte generated by Svelte v3.29.0 */

    const { console: console_1$1 } = globals;
    const file$5 = "src/micro/folderview.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (69:18) {#if i == disp}
    function create_if_block$2(ctx) {
    	let img;
    	let img_src_value;
    	let img_transition;
    	let current;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*pic*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1rzpcka");
    			add_location(img, file$5, 68, 33, 1491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*pics*/ 1 && img.src !== (img_src_value = /*pic*/ ctx[4])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!img_transition) img_transition = create_bidirectional_transition(img, slide, {}, true);
    				img_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!img_transition) img_transition = create_bidirectional_transition(img, slide, {}, false);
    			img_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching && img_transition) img_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(69:18) {#if i == disp}",
    		ctx
    	});

    	return block;
    }

    // (67:6) {#each pics as pic, i}
    function create_each_block(ctx) {
    	let div;
    	let current;
    	let if_block = /*i*/ ctx[6] == /*disp*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "picture svelte-1rzpcka");
    			add_location(div, file$5, 67, 12, 1436);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[6] == /*disp*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*disp*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(67:6) {#each pics as pic, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div2;
    	let div0;
    	let svg0;
    	let path0;
    	let t0;
    	let t1;
    	let div1;
    	let svg1;
    	let path1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*pics*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M20 30 L8 16 20 2");
    			add_location(path0, file$5, 63, 18, 1332);
    			attr_dev(svg0, "id", "i-chevron-left");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 32 32");
    			attr_dev(svg0, "width", "32");
    			attr_dev(svg0, "height", "32");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke", "currentcolor");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "class", "svelte-1rzpcka");
    			add_location(svg0, file$5, 52, 12, 932);
    			attr_dev(div0, "class", "left svelte-1rzpcka");
    			add_location(div0, file$5, 51, 6, 885);
    			attr_dev(path1, "d", "M12 30 L24 16 12 2");
    			add_location(path1, file$5, 83, 18, 2026);
    			attr_dev(svg1, "id", "i-chevron-right");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 32 32");
    			attr_dev(svg1, "width", "32");
    			attr_dev(svg1, "height", "32");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke", "currentcolor");
    			attr_dev(svg1, "stroke-linecap", "round");
    			attr_dev(svg1, "stroke-linejoin", "round");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "class", "svelte-1rzpcka");
    			add_location(svg1, file$5, 72, 12, 1625);
    			attr_dev(div1, "class", "right svelte-1rzpcka");
    			add_location(div1, file$5, 71, 6, 1577);
    			attr_dev(div2, "class", "slider");
    			add_location(div2, file$5, 50, 0, 858);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div2, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*decr*/ ctx[2], false, false, false),
    					listen_dev(div1, "click", /*incr*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pics, disp*/ 3) {
    				each_value = /*pics*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Folderview", slots, []);
    	let { pics } = $$props;
    	console.log(pics.length);

    	const decr = () => {
    		$$invalidate(1, disp = disp == 0 ? pics.length - 1 : disp - 1);
    	};

    	const incr = () => {
    		$$invalidate(1, disp = disp == pics.length - 1 ? 0 : disp + 1);
    		console.log(disp);
    	};

    	const writable_props = ["pics"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Folderview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("pics" in $$props) $$invalidate(0, pics = $$props.pics);
    	};

    	$$self.$capture_state = () => ({ slide, pics, decr, incr, disp });

    	$$self.$inject_state = $$props => {
    		if ("pics" in $$props) $$invalidate(0, pics = $$props.pics);
    		if ("disp" in $$props) $$invalidate(1, disp = $$props.disp);
    	};

    	let disp;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(1, disp = 0);
    	return [pics, disp, decr, incr];
    }

    class Folderview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { pics: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Folderview",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pics*/ ctx[0] === undefined && !("pics" in props)) {
    			console_1$1.warn("<Folderview> was created without expected prop 'pics'");
    		}
    	}

    	get pics() {
    		throw new Error("<Folderview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pics(value) {
    		throw new Error("<Folderview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/contact.svelte generated by Svelte v3.29.0 */
    const file$6 = "src/components/contact.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (257:30) <Lazy                                     offset={100}                                     fadeOption={{ delay: 0, duration: 500 }}                                     height={300}>
    function create_default_slot_1$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "height", "1em");
    			attr_dev(img, "width", "1em");
    			attr_dev(img, "alt", "");
    			if (img.src !== (img_src_value = /*person*/ ctx[16].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-c7az76");
    			add_location(img, file$6, 260, 36, 10305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(257:30) <Lazy                                     offset={100}                                     fadeOption={{ delay: 0, duration: 500 }}                                     height={300}>",
    		ctx
    	});

    	return block;
    }

    // (255:18) {#each people as person}
    function create_each_block_1(ctx) {
    	let div2;
    	let lazy;
    	let t0;
    	let div1;
    	let span0;
    	let t1_value = /*person*/ ctx[16].name + "";
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let span1;
    	let t4_value = /*person*/ ctx[16].post + "";
    	let t4;
    	let t5;
    	let div0;
    	let a0;
    	let svg0;
    	let path0;
    	let a0_href_value;
    	let t6;
    	let a1;
    	let svg1;
    	let path1;
    	let a1_href_value;
    	let t7;
    	let current;

    	lazy = new Src({
    			props: {
    				offset: 100,
    				fadeOption: { delay: 0, duration: 500 },
    				height: 300,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(lazy.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			br = element("br");
    			t3 = space();
    			span1 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			div0 = element("div");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t6 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t7 = space();
    			set_style(span0, "font-weight", "500");
    			add_location(span0, file$6, 267, 36, 10658);
    			add_location(br, file$6, 270, 36, 10825);
    			set_style(span1, "font-weight", "400");
    			set_style(span1, "color", "#bbb");
    			set_style(span1, "font-size", "0.75em");
    			add_location(span1, file$6, 271, 36, 10868);
    			attr_dev(path0, "d", "M2 26 L30 26 30 6 2 6 Z M2 6 L16 16 30 6");
    			add_location(path0, file$6, 285, 54, 11884);
    			attr_dev(svg0, "id", "i-mail");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 32 32");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke", "currentcolor");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "class", "svelte-c7az76");
    			add_location(svg0, file$6, 276, 48, 11227);
    			attr_dev(a0, "href", a0_href_value = /*person*/ ctx[16].mail);
    			add_location(a0, file$6, 275, 42, 11156);
    			attr_dev(path1, "fill", "#aaa");
    			attr_dev(path1, "d", "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z");
    			add_location(path1, file$6, 293, 54, 12442);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 512 512");
    			attr_dev(svg1, "class", "svelte-c7az76");
    			add_location(svg1, file$6, 290, 48, 12217);
    			attr_dev(a1, "href", a1_href_value = /*person*/ ctx[16].linkedin);
    			add_location(a1, file$6, 289, 42, 12142);
    			set_style(div0, "padding", "0");
    			set_style(div0, "margin", "0");
    			set_style(div0, "display", "flex");
    			attr_dev(div0, "class", "svelte-c7az76");
    			add_location(div0, file$6, 273, 36, 11025);
    			attr_dev(div1, "class", "subperson svelte-c7az76");
    			add_location(div1, file$6, 266, 30, 10598);
    			attr_dev(div2, "class", "person svelte-c7az76");
    			add_location(div2, file$6, 255, 24, 10036);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(lazy, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, br);
    			append_dev(div1, t3);
    			append_dev(div1, span1);
    			append_dev(span1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, t6);
    			append_dev(div0, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div2, t7);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lazy_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				lazy_changes.$$scope = { dirty, ctx };
    			}

    			lazy.$set(lazy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lazy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lazy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(lazy);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(255:18) {#each people as person}",
    		ctx
    	});

    	return block;
    }

    // (328:30) <Lazy                                     offset={100}                                     fadeOption={{ delay: 0, duration: 500 }}                                     height={300}>
    function create_default_slot$1(ctx) {
    	let img;
    	let img_id_value;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "id", img_id_value = /*i*/ ctx[15]);
    			if (img.src !== (img_src_value = /*folder*/ ctx[13].thumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-c7az76");
    			add_location(img, file$6, 331, 36, 14592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*crs*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(328:30) <Lazy                                     offset={100}                                     fadeOption={{ delay: 0, duration: 500 }}                                     height={300}>",
    		ctx
    	});

    	return block;
    }

    // (326:18) {#each gallery as folder, i}
    function create_each_block$1(ctx) {
    	let div;
    	let lazy;
    	let t0;
    	let t1_value = /*folder*/ ctx[13].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*folder*/ ctx[13].data.length + "";
    	let t3;
    	let t4;
    	let current;

    	lazy = new Src({
    			props: {
    				offset: 100,
    				fadeOption: { delay: 0, duration: 500 },
    				height: 300,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(lazy.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = text("\n                              (");
    			t3 = text(t3_value);
    			t4 = text("\n                              items)\n                        ");
    			attr_dev(div, "class", "folder svelte-c7az76");
    			add_location(div, file$6, 326, 24, 14323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(lazy, div, null);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lazy_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				lazy_changes.$$scope = { dirty, ctx };
    			}

    			lazy.$set(lazy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lazy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lazy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(lazy);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(326:18) {#each gallery as folder, i}",
    		ctx
    	});

    	return block;
    }

    // (347:0) {#if showFolder}
    function create_if_block$3(ctx) {
    	let div1;
    	let div0;
    	let svg;
    	let path;
    	let t;
    	let carousel;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;

    	carousel = new Folderview({
    			props: { pics: /*pics*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = space();
    			create_component(carousel.$$.fragment);
    			attr_dev(path, "d", "M2 30 L30 2 M30 30 L2 2");
    			add_location(path, file$6, 364, 24, 15841);
    			attr_dev(svg, "id", "i-close");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "width", "32");
    			attr_dev(svg, "height", "32");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "#fff");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "class", "svelte-c7az76");
    			add_location(svg, file$6, 353, 18, 15390);
    			set_style(div0, "position", "absolute");
    			set_style(div0, "right", "1em");
    			set_style(div0, "top", "5em");
    			set_style(div0, "z-index", "3");
    			attr_dev(div0, "class", "svelte-c7az76");
    			add_location(div0, file$6, 350, 12, 15257);
    			set_style(div1, "width", "100vw");
    			set_style(div1, "height", "100vh");
    			set_style(div1, "background", "#00000088:z-index:2:position:absolute");
    			set_style(div1, "top", "0");
    			attr_dev(div1, "class", "svelte-c7az76");
    			add_location(div1, file$6, 347, 6, 15111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div1, t);
    			mount_component(carousel, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*hideCar*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const carousel_changes = {};
    			if (dirty & /*pics*/ 8) carousel_changes.pics = /*pics*/ ctx[3];
    			carousel.$set(carousel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(carousel.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(carousel.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(carousel);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(347:0) {#if showFolder}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div12;
    	let section0;
    	let div3;
    	let div0;
    	let svg0;
    	let path0;
    	let br0;
    	let t0;
    	let t1;
    	let div1;
    	let svg1;
    	let path1;
    	let circle0;
    	let br1;
    	let t2;
    	let t3;
    	let div2;
    	let svg2;
    	let path2;
    	let t4;
    	let br2;
    	let t5;
    	let t6;
    	let div7;
    	let form;
    	let div4;
    	let input0;
    	let t7;
    	let label0;
    	let t9;
    	let div5;
    	let input1;
    	let t10;
    	let label1;
    	let t12;
    	let div6;
    	let input2;
    	let t13;
    	let label2;
    	let t15;
    	let input3;
    	let t16;
    	let div8;
    	let hr;
    	let t17;
    	let object;
    	let t18;
    	let div9;
    	let t19;
    	let section1;
    	let div10;
    	let span;
    	let t21;
    	let svg3;
    	let path3;
    	let circle1;
    	let t22;
    	let div11;
    	let t23;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*people*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*gallery*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*showFolder*/ ctx[4] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			section0 = element("section");
    			div3 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			br0 = element("br");
    			t0 = text("\n                        Let's Talk!");
    			t1 = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			circle0 = svg_element("circle");
    			br1 = element("br");
    			t2 = text("\n                        Queries?");
    			t3 = space();
    			div2 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t4 = space();
    			br2 = element("br");
    			t5 = text("\n                        Sponsor Us :)");
    			t6 = space();
    			div7 = element("div");
    			form = element("form");
    			div4 = element("div");
    			input0 = element("input");
    			t7 = space();
    			label0 = element("label");
    			label0.textContent = "Name";
    			t9 = space();
    			div5 = element("div");
    			input1 = element("input");
    			t10 = space();
    			label1 = element("label");
    			label1.textContent = "Email";
    			t12 = space();
    			div6 = element("div");
    			input2 = element("input");
    			t13 = space();
    			label2 = element("label");
    			label2.textContent = "Message";
    			t15 = space();
    			input3 = element("input");
    			t16 = space();
    			div8 = element("div");
    			hr = element("hr");
    			t17 = space();
    			object = element("object");
    			t18 = space();
    			div9 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t19 = space();
    			section1 = element("section");
    			div10 = element("div");
    			span = element("span");
    			span.textContent = "Gallery";
    			t21 = space();
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			circle1 = svg_element("circle");
    			t22 = space();
    			div11 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t23 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(path0, "d", "M2 4 L30 4 30 22 16 22 8 29 8 22 2 22 Z");
    			add_location(path0, file$6, 180, 30, 4533);
    			attr_dev(svg0, "id", "i-msg");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 32 32");
    			attr_dev(svg0, "width", "32");
    			attr_dev(svg0, "height", "32");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke", "currentcolor");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "class", "svelte-c7az76");
    			add_location(svg0, file$6, 169, 24, 4010);
    			add_location(br0, file$6, 182, 30, 4652);
    			attr_dev(div0, "class", "svelte-c7az76");
    			add_location(div0, file$6, 168, 18, 3980);
    			attr_dev(path1, "d", "M16 14 L16 23 M16 8 L16 10");
    			add_location(path1, file$6, 197, 30, 5292);
    			attr_dev(circle0, "cx", "16");
    			attr_dev(circle0, "cy", "16");
    			attr_dev(circle0, "r", "14");
    			add_location(circle0, file$6, 198, 30, 5362);
    			attr_dev(svg1, "id", "i-info");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 32 32");
    			attr_dev(svg1, "width", "32");
    			attr_dev(svg1, "height", "32");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke", "currentcolor");
    			attr_dev(svg1, "stroke-linecap", "round");
    			attr_dev(svg1, "stroke-linejoin", "round");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "class", "svelte-c7az76");
    			add_location(svg1, file$6, 186, 24, 4768);
    			add_location(br1, file$6, 199, 30, 5426);
    			attr_dev(div1, "class", "svelte-c7az76");
    			add_location(div1, file$6, 185, 18, 4738);
    			attr_dev(path2, "d", "M897 306l-80-137c-2-4-7-5-11-4 0 0-22 9-46 9 -9 0-20-5-33-12 -18-9-40-19-66-19 -24 0-44 7-60 17 -18-12-37-20-59-22 -26-2-49 7-67 14 -13 5-25 10-34 9 -23-2-44-12-45-13 -4-2-9-1-11 3l-91 130c-3 4-2 9 2 12l97 81 0 0c-7 7-11 17-11 27 0 10 4 20 11 27 7 7 17 11 27 11 2 0 5 0 7-1 0 10 4 20 11 27 7 7 17 11 27 11 3 0 6 0 10-1 1 9 4 18 11 25 7 7 17 11 27 11 3 0 5 0 8-1 17 21 38 28 58 28 12 0 24-3 32-6 6 2 13 3 20 3 15 0 29-5 39-14 5 2 9 3 14 3 10 0 20-4 27-11 5-5 9-12 10-20 6 3 12 5 19 5 10 0 19-4 27-11 6-6 10-15 11-23 4 1 7 2 11 2 10 0 20-4 27-11 7-7 11-17 11-27 0-10-4-20-11-27l-15-15 95-66C898 315 900 310 897 306zM433 414c-4 4-9 6-14 6 -5 0-10-2-14-6 -4-4-6-9-6-14 0-5 2-10 6-14l17-17c4-4 9-6 14-6 5 0 10 2 14 6 4 4 6 9 6 14 0 5-2 10-6 14L433 414zM485 445l-6 6c-4 4-9 6-14 6 -5 0-10-2-14-6 -4-4-6-9-6-14 0-5 2-10 6-14l39-39c4-4 9-6 14-6 5 0 10 2 14 6 4 4 6 9 6 14 0 5-2 10-6 14l-32 32C485 445 485 445 485 445zM511 492c-5 0-10-2-14-6 -8-8-8-20 0-28l32-32c0 0 0 0 0 0l6-6c4-4 9-6 14-6 5 0 10 2 14 6 4 4 6 9 6 14 0 5-2 10-6 14l-39 39C522 490 517 492 511 492zM579 506c1 4 4 8 8 12 -14 2-35 1-51-17 1-1 2-1 2-2l39-39c0 0 1-1 1-2 14 11 11 16 6 24C581 489 577 496 579 506zM801 412c4 4 6 9 6 14 0 5-2 10-6 14 -4 4-9 6-14 6 -5 0-10-2-14-6l-90-90c-4-4-9-4-13 0 -4 4-4 9 0 13l82 82c0 0 0 0 0 0 4 4 6 9 6 14 0 5-2 10-6 14 -4 4-9 6-14 6s-10-2-14-6l-15-15c0 0 0 0 0 0 0 0 0 0 0 0l-54-54c-4-4-9-4-13 0 -4 4-4 9 0 13l54 54c4 4 6 9 6 14 0 5-2 10-6 14 -4 4-9 6-14 6h0c-5 0-10-2-14-6l-33-33c-4-4-9-4-13 0 -4 4-4 9 0 13l30 30c-6 4-15 7-24 7 -6 0-12-1-17-3 -13-7-15-11-15-12 -1-2 1-5 3-9 8-13 13-29-13-49 1-3 1-6 1-9 0-10-4-20-11-27 -7-7-17-11-27-11 -3 0-6 0-10 1 -1-9-4-18-11-25 -7-7-17-11-27-11s-20 4-27 11l-2 2c-2-7-5-13-10-18 -7-7-17-11-27-11 -10 0-20 4-27 11l-4 4c0 0 0 0-1-1l-91-76 82-117c9 4 26 10 44 11 13 1 27-4 42-10 18-7 38-14 59-13 16 1 30 6 44 15 -18 14-30 31-38 43 -4 7-42 68-32 99 2 7 7 13 14 15 5 2 10 3 15 3 24 0 42-22 59-43 13-16 26-32 39-35l82 82 9 9 45 46c0 0 0 0 0 0L801 412zM786 371l-49-49c0 0 0 0 0 0l-86-86c-2-2-4-3-6-3 0 0 0 0-1 0 -22 1-39 22-55 42 -15 18-30 37-45 37 -3 0-5-1-8-2 -1-1-3-1-4-4 -5-15 12-55 30-84 15-23 47-63 99-63 22 0 41 9 58 18 14 7 28 13 41 13 18 0 35-4 45-7l72 124L786 371z");
    			attr_dev(path2, "fill", "currentcolor");
    			add_location(path2, file$6, 208, 30, 5779);
    			attr_dev(svg2, "width", "48");
    			attr_dev(svg2, "height", "34");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "308 260 580 170");
    			attr_dev(svg2, "class", "svelte-c7az76");
    			add_location(svg2, file$6, 203, 24, 5539);
    			add_location(br2, file$6, 212, 24, 8137);
    			attr_dev(div2, "class", "svelte-c7az76");
    			add_location(div2, file$6, 202, 18, 5509);
    			set_style(div3, "display", "flex");
    			set_style(div3, "justify-content", "space-around");
    			set_style(div3, "padding", "0.5em 0");
    			set_style(div3, "pointer-events", "none");
    			attr_dev(div3, "class", "svelte-c7az76");
    			add_location(div3, file$6, 166, 12, 3851);
    			input0.required = true;
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			set_style(input0, "height", "1.75rem");
    			attr_dev(input0, "class", "svelte-c7az76");
    			add_location(input0, file$6, 219, 30, 8355);
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-c7az76");
    			add_location(label0, file$6, 225, 30, 8651);
    			attr_dev(div4, "class", "inputBox svelte-c7az76");
    			add_location(div4, file$6, 218, 24, 8302);
    			input1.required = true;
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "email");
    			set_style(input1, "height", "1.75rem");
    			attr_dev(input1, "class", "svelte-c7az76");
    			add_location(input1, file$6, 228, 30, 8790);
    			attr_dev(label1, "for", "email");
    			attr_dev(label1, "class", "svelte-c7az76");
    			add_location(label1, file$6, 234, 30, 9088);
    			attr_dev(div5, "class", "inputBox svelte-c7az76");
    			add_location(div5, file$6, 227, 24, 8737);
    			input2.required = true;
    			attr_dev(input2, "name", "msg");
    			attr_dev(input2, "class", "svelte-c7az76");
    			add_location(input2, file$6, 237, 30, 9229);
    			attr_dev(label2, "for", "msg");
    			attr_dev(label2, "size", "10");
    			attr_dev(label2, "class", "svelte-c7az76");
    			add_location(label2, file$6, 238, 30, 9306);
    			attr_dev(div6, "class", "inputBox svelte-c7az76");
    			add_location(div6, file$6, 236, 24, 9176);
    			attr_dev(input3, "type", "submit");
    			attr_dev(input3, "class", "svelte-c7az76");
    			add_location(input3, file$6, 240, 24, 9404);
    			attr_dev(form, "onsubmit", "");
    			add_location(form, file$6, 217, 18, 8262);
    			add_location(div7, file$6, 216, 12, 8238);
    			set_style(hr, "width", "100%");
    			set_style(hr, "border-radius", "5px");
    			set_style(hr, "border", "2px dashed #ff666688");
    			set_style(hr, "height", "0");
    			add_location(hr, file$6, 244, 18, 9564);
    			attr_dev(object, "width", "100px");
    			attr_dev(object, "height", "20px");
    			attr_dev(object, "title", "f1car");
    			attr_dev(object, "data", "./assets/micro/f1.svg");
    			attr_dev(object, "type", "image/svg+xml");
    			add_location(object, file$6, 246, 18, 9688);
    			set_style(div8, "display", "flex");
    			set_style(div8, "align-items", "center");
    			set_style(div8, "padding", "1em 0");
    			add_location(div8, file$6, 243, 12, 9485);
    			set_style(div9, "margin", "1em 0");
    			add_location(div9, file$6, 253, 12, 9942);
    			attr_dev(section0, "class", "right svelte-c7az76");
    			add_location(section0, file$6, 165, 6, 3815);
    			set_style(span, "font-size", "2.5em");
    			add_location(span, file$6, 306, 18, 13411);
    			attr_dev(path3, "d", "M20 24 L12 16 2 26 2 2 30 2 30 24 M16 20 L22 14 30 22 30 30 2 30 2 24");
    			add_location(path3, file$6, 318, 24, 13934);
    			attr_dev(circle1, "cx", "10");
    			attr_dev(circle1, "cy", "9");
    			attr_dev(circle1, "r", "3");
    			add_location(circle1, file$6, 320, 24, 14071);
    			attr_dev(svg3, "id", "i-photo");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 32 32");
    			attr_dev(svg3, "width", "32");
    			attr_dev(svg3, "height", "32");
    			attr_dev(svg3, "fill", "none");
    			attr_dev(svg3, "stroke", "currentcolor");
    			attr_dev(svg3, "stroke-linecap", "round");
    			attr_dev(svg3, "stroke-linejoin", "round");
    			attr_dev(svg3, "stroke-width", "2");
    			attr_dev(svg3, "class", "svelte-c7az76");
    			add_location(svg3, file$6, 307, 18, 13475);
    			set_style(div10, "line-height", "0.75rem");
    			set_style(div10, "padding", "1em");
    			set_style(div10, "margin-bottom", "1em");
    			attr_dev(div10, "class", "svelte-c7az76");
    			add_location(div10, file$6, 305, 12, 13328);
    			set_style(div11, "display", "flex");
    			set_style(div11, "flex-wrap", "wrap");
    			set_style(div11, "justify-content", "space-around");
    			add_location(div11, file$6, 323, 12, 14159);
    			attr_dev(section1, "class", "left svelte-c7az76");
    			add_location(section1, file$6, 304, 6, 13293);
    			attr_dev(div12, "class", "contact svelte-c7az76");
    			set_style(div12, "z-index", "1");
    			attr_dev(div12, "id", "#contTop");
    			add_location(div12, file$6, 164, 0, 3755);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, section0);
    			append_dev(section0, div3);
    			append_dev(div3, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, br0);
    			append_dev(div0, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);
    			append_dev(svg1, circle0);
    			append_dev(div1, br1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, svg2);
    			append_dev(svg2, path2);
    			append_dev(div2, t4);
    			append_dev(div2, br2);
    			append_dev(div2, t5);
    			append_dev(section0, t6);
    			append_dev(section0, div7);
    			append_dev(div7, form);
    			append_dev(form, div4);
    			append_dev(div4, input0);
    			set_input_value(input0, /*name*/ ctx[2]);
    			append_dev(div4, t7);
    			append_dev(div4, label0);
    			append_dev(form, t9);
    			append_dev(form, div5);
    			append_dev(div5, input1);
    			set_input_value(input1, /*email*/ ctx[0]);
    			append_dev(div5, t10);
    			append_dev(div5, label1);
    			append_dev(form, t12);
    			append_dev(form, div6);
    			append_dev(div6, input2);
    			set_input_value(input2, /*msg*/ ctx[1]);
    			append_dev(div6, t13);
    			append_dev(div6, label2);
    			append_dev(form, t15);
    			append_dev(form, input3);
    			append_dev(section0, t16);
    			append_dev(section0, div8);
    			append_dev(div8, hr);
    			append_dev(div8, t17);
    			append_dev(div8, object);
    			append_dev(section0, t18);
    			append_dev(section0, div9);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div9, null);
    			}

    			append_dev(div12, t19);
    			append_dev(div12, section1);
    			append_dev(section1, div10);
    			append_dev(div10, span);
    			append_dev(div10, t21);
    			append_dev(div10, svg3);
    			append_dev(svg3, path3);
    			append_dev(svg3, circle1);
    			append_dev(section1, t22);
    			append_dev(section1, div11);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div11, null);
    			}

    			insert_dev(target, t23, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 4 && input0.value !== /*name*/ ctx[2]) {
    				set_input_value(input0, /*name*/ ctx[2]);
    			}

    			if (dirty & /*email*/ 1 && input1.value !== /*email*/ ctx[0]) {
    				set_input_value(input1, /*email*/ ctx[0]);
    			}

    			if (dirty & /*msg*/ 2 && input2.value !== /*msg*/ ctx[1]) {
    				set_input_value(input2, /*msg*/ ctx[1]);
    			}

    			if (dirty & /*people*/ 32) {
    				each_value_1 = /*people*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div9, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*gallery, crs*/ 320) {
    				each_value = /*gallery*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div11, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (/*showFolder*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showFolder*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t23);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Contact", slots, []);
    	let { data } = $$props;
    	const people = data.people;
    	const gallery = data.gallery;
    	let email = "", msg = "", name = "";

    	const hideCar = () => {
    		$$invalidate(4, showFolder = 0);
    	};

    	const crs = e => {
    		$$invalidate(3, pics = gallery[+e.target.id].data);
    		$$invalidate(4, showFolder = 1);
    		window.scrollTo(0, 0);
    	};

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(2, name);
    	}

    	function input1_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	function input2_input_handler() {
    		msg = this.value;
    		$$invalidate(1, msg);
    	}

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(9, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		Lazy: Src,
    		Carousel: Folderview,
    		fade,
    		data,
    		people,
    		gallery,
    		email,
    		msg,
    		name,
    		hideCar,
    		crs,
    		pics,
    		showFolder
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(9, data = $$props.data);
    		if ("email" in $$props) $$invalidate(0, email = $$props.email);
    		if ("msg" in $$props) $$invalidate(1, msg = $$props.msg);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("pics" in $$props) $$invalidate(3, pics = $$props.pics);
    		if ("showFolder" in $$props) $$invalidate(4, showFolder = $$props.showFolder);
    	};

    	let pics;
    	let showFolder;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(3, pics = gallery[0].data);
    	 $$invalidate(4, showFolder = 0);

    	return [
    		email,
    		msg,
    		name,
    		pics,
    		showFolder,
    		people,
    		gallery,
    		hideCar,
    		crs,
    		data,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { data: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[9] === undefined && !("data" in props)) {
    			console.warn("<Contact> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/micro/socials.svelte generated by Svelte v3.29.0 */

    const file$7 = "src/micro/socials.svelte";

    function create_fragment$b(ctx) {
    	let article;
    	let div1;
    	let div0;
    	let t0;
    	let br0;
    	let t1;
    	let br1;
    	let t2;
    	let t3;
    	let svg;
    	let defs;
    	let linearGradient0;
    	let stop0;
    	let stop1;
    	let stop2;
    	let linearGradient1;
    	let stop3;
    	let stop4;
    	let stop5;
    	let stop6;
    	let radialGradient0;
    	let radialGradient1;
    	let path0;
    	let path1;
    	let path2;
    	let t4;
    	let div3;
    	let div2;
    	let t5;
    	let br2;
    	let t6;
    	let br3;
    	let t7;
    	let t8;
    	let t9;
    	let div5;
    	let div4;
    	let t10;
    	let br4;
    	let t11;
    	let br5;
    	let t12;
    	let t13;

    	const block = {
    		c: function create() {
    			article = element("article");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Baja ");
    			br0 = element("br");
    			t1 = text(" Supra");
    			br1 = element("br");
    			t2 = text(" Aero");
    			t3 = space();
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			linearGradient0 = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			stop2 = svg_element("stop");
    			linearGradient1 = svg_element("linearGradient");
    			stop3 = svg_element("stop");
    			stop4 = svg_element("stop");
    			stop5 = svg_element("stop");
    			stop6 = svg_element("stop");
    			radialGradient0 = svg_element("radialGradient");
    			radialGradient1 = svg_element("radialGradient");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t5 = text("Baja ");
    			br2 = element("br");
    			t6 = text(" Supra");
    			br3 = element("br");
    			t7 = text(" Aero");
    			t8 = text("\n            fb logo");
    			t9 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t10 = text("Baja ");
    			br4 = element("br");
    			t11 = text(" Supra");
    			br5 = element("br");
    			t12 = text(" Aero");
    			t13 = text("\n            wordpress logo");
    			add_location(br0, file$7, 13, 37, 225);
    			add_location(br1, file$7, 13, 49, 237);
    			attr_dev(div0, "class", "hidden");
    			add_location(div0, file$7, 13, 12, 200);
    			attr_dev(stop0, "offset", "0");
    			attr_dev(stop0, "stop-color", "#3771c8");
    			add_location(stop0, file$7, 20, 30, 536);
    			attr_dev(stop1, "stop-color", "#3771c8");
    			attr_dev(stop1, "offset", ".128");
    			add_location(stop1, file$7, 21, 30, 607);
    			attr_dev(stop2, "offset", "1");
    			attr_dev(stop2, "stop-color", "#60f");
    			attr_dev(stop2, "stop-opacity", "0");
    			add_location(stop2, file$7, 22, 30, 681);
    			attr_dev(linearGradient0, "id", "b");
    			add_location(linearGradient0, file$7, 19, 24, 482);
    			attr_dev(stop3, "offset", "0");
    			attr_dev(stop3, "stop-color", "#fd5");
    			add_location(stop3, file$7, 28, 30, 964);
    			attr_dev(stop4, "offset", ".1");
    			attr_dev(stop4, "stop-color", "#fd5");
    			add_location(stop4, file$7, 29, 30, 1032);
    			attr_dev(stop5, "offset", ".5");
    			attr_dev(stop5, "stop-color", "#ff543e");
    			add_location(stop5, file$7, 30, 30, 1101);
    			attr_dev(stop6, "offset", "1");
    			attr_dev(stop6, "stop-color", "#c837ab");
    			add_location(stop6, file$7, 31, 30, 1173);
    			attr_dev(linearGradient1, "id", "a");
    			add_location(linearGradient1, file$7, 27, 24, 910);
    			attr_dev(radialGradient0, "id", "c");
    			attr_dev(radialGradient0, "cx", "158.429");
    			attr_dev(radialGradient0, "cy", "578.088");
    			attr_dev(radialGradient0, "r", "65");
    			xlink_attr(radialGradient0, "xlink:href", "#a");
    			attr_dev(radialGradient0, "gradientUnits", "userSpaceOnUse");
    			attr_dev(radialGradient0, "gradientTransform", "matrix(0 -1.98198 1.8439 0 -1031.402 454.004)");
    			attr_dev(radialGradient0, "fx", "158.429");
    			attr_dev(radialGradient0, "fy", "578.088");
    			add_location(radialGradient0, file$7, 33, 24, 1280);
    			attr_dev(radialGradient1, "id", "d");
    			attr_dev(radialGradient1, "cx", "147.694");
    			attr_dev(radialGradient1, "cy", "473.455");
    			attr_dev(radialGradient1, "r", "65");
    			xlink_attr(radialGradient1, "xlink:href", "#b");
    			attr_dev(radialGradient1, "gradientUnits", "userSpaceOnUse");
    			attr_dev(radialGradient1, "gradientTransform", "matrix(.17394 .86872 -3.5818 .71718 1648.348 -458.493)");
    			attr_dev(radialGradient1, "fx", "147.694");
    			attr_dev(radialGradient1, "fy", "473.455");
    			add_location(radialGradient1, file$7, 43, 24, 1772);
    			add_location(defs, file$7, 18, 61, 451);
    			attr_dev(path0, "fill", "url(#c)");
    			attr_dev(path0, "d", "M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z");
    			attr_dev(path0, "transform", "translate(1.004 1)");
    			add_location(path0, file$7, 54, 18, 2293);
    			attr_dev(path1, "fill", "url(#d)");
    			attr_dev(path1, "d", "M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z");
    			attr_dev(path1, "transform", "translate(1.004 1)");
    			add_location(path1, file$7, 58, 18, 3097);
    			attr_dev(path2, "fill", "#fff");
    			attr_dev(path2, "d", "M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z");
    			add_location(path2, file$7, 62, 18, 3901);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "132.004");
    			attr_dev(svg, "height", "132");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			add_location(svg, file$7, 14, 12, 267);
    			attr_dev(div1, "class", "drawer");
    			add_location(div1, file$7, 12, 6, 167);
    			add_location(br2, file$7, 67, 37, 5950);
    			add_location(br3, file$7, 67, 49, 5962);
    			attr_dev(div2, "class", "hidden");
    			add_location(div2, file$7, 67, 12, 5925);
    			attr_dev(div3, "class", "drawer");
    			add_location(div3, file$7, 66, 6, 5892);
    			add_location(br4, file$7, 71, 37, 6077);
    			add_location(br5, file$7, 71, 49, 6089);
    			attr_dev(div4, "class", "hidden");
    			add_location(div4, file$7, 71, 12, 6052);
    			attr_dev(div5, "class", "drawer");
    			add_location(div5, file$7, 70, 6, 6019);
    			attr_dev(article, "class", "socials svelte-l6145k");
    			add_location(article, file$7, 11, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, br0);
    			append_dev(div0, t1);
    			append_dev(div0, br1);
    			append_dev(div0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, svg);
    			append_dev(svg, defs);
    			append_dev(defs, linearGradient0);
    			append_dev(linearGradient0, stop0);
    			append_dev(linearGradient0, stop1);
    			append_dev(linearGradient0, stop2);
    			append_dev(defs, linearGradient1);
    			append_dev(linearGradient1, stop3);
    			append_dev(linearGradient1, stop4);
    			append_dev(linearGradient1, stop5);
    			append_dev(linearGradient1, stop6);
    			append_dev(defs, radialGradient0);
    			append_dev(defs, radialGradient1);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(article, t4);
    			append_dev(article, div3);
    			append_dev(div3, div2);
    			append_dev(div2, t5);
    			append_dev(div2, br2);
    			append_dev(div2, t6);
    			append_dev(div2, br3);
    			append_dev(div2, t7);
    			append_dev(div3, t8);
    			append_dev(article, t9);
    			append_dev(article, div5);
    			append_dev(div5, div4);
    			append_dev(div4, t10);
    			append_dev(div4, br4);
    			append_dev(div4, t11);
    			append_dev(div4, br5);
    			append_dev(div4, t12);
    			append_dev(div5, t13);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Socials", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Socials> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Socials extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Socials",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    var contact = {
    	gallery: [
    		{
    			name: "BITSAA Global Meet",
    			thumb: "https://lh3.googleusercontent.com/FeR3mUzuXER4tKYYvTonCdQXzyUscQFiPxCjrIElpTROnCg4ZZAZOS1d11CrF0BRzAfgzR6AWne9qQFnbKZ8J9QqVOsp8l1s0yubv1fEXiTX8Oqsna8GcnRhLPImERN0DoTDakcA",
    			data: [
    				"https://www.formula1.com/content/dam/fom-website/manual/Misc/2020/Misc/GettyImages-1262699302.jpg.transform/6col/image.jpg",
    				"https://www.formula1.com/content/dam/fom-website/manual/Technical/2020/Russia/FER-RUSSIA-F1_Tech_Tuesday.jpg.transform/6col/image.jpg"
    			]
    		},
    		{
    			name: "Quark",
    			thumb: "https://lh3.googleusercontent.com/FeR3mUzuXER4tKYYvTonCdQXzyUscQFiPxCjrIElpTROnCg4ZZAZOS1d11CrF0BRzAfgzR6AWne9qQFnbKZ8J9QqVOsp8l1s0yubv1fEXiTX8Oqsna8GcnRhLPImERN0DoTDakcA",
    			data: [
    				"https://www.formula1.com/content/dam/fom-website/manual/Misc/2020/2020races/Mugello/RoadToF1/GettyImages-1266452276%20(1).jpg.transform/6col/image.jpg",
    				"https://www.formula1.com/content/dam/fom-website/sutton/2020/Russia/Sunday/1276939942.jpg.transform/6col/image.jpg"
    			]
    		}
    	],
    	people: [
    		{
    			name: "Rugved Katole",
    			img: "https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/e35/95355757_238443087263421_2071635142811609194_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=NCLJL8qexCQAX_gJGL3&_nc_tp=18&oh=f28993d4043ad9b0e99c865cf260bd27&oe=5F9FB056",
    			post: "Chairperson",
    			mail: "www.google.com",
    			linkedin: "www.google.com"
    		},
    		{
    			name: "Amal M Nair",
    			img: "https://picsum.photos/id/412/200/300",
    			post: "Vice Chairperson",
    			mail: "mailto:amalmnair1999@gmail.com",
    			linkedin: "https://linkedin.com/in/amal-nair-90886819b/"
    		},
    		{
    			name: "Hemang Agarwal",
    			img: "https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/e35/95856210_2518834825045274_1755762509371242428_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=Gvr1XdXtNBsAX_TjLne&_nc_tp=18&oh=3c1cb07b3dfc9787b8513b22e3de30b8&oe=5FA04172",
    			post: "Treasurer",
    			mail: "www.google.com",
    			linkedin: "www.google.com"
    		}
    	]
    };
    var data = {
    	contact: contact
    };

    /* src/App.svelte generated by Svelte v3.29.0 */
    const file$8 = "src/App.svelte";

    // (47:30) 
    function create_if_block_6(ctx) {
    	let div;
    	let contact;
    	let div_transition;
    	let current;

    	contact = new Contact({
    			props: { data: data.contact },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(contact.$$.fragment);
    			add_location(div, file$8, 47, 2, 1089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(contact, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contact.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contact.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(contact);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(47:30) ",
    		ctx
    	});

    	return block;
    }

    // (43:28) 
    function create_if_block_5(ctx) {
    	let div;
    	let spons;
    	let div_transition;
    	let current;
    	spons = new Spons({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(spons.$$.fragment);
    			add_location(div, file$8, 43, 2, 1012);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(spons, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spons.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spons.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(spons);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(43:28) ",
    		ctx
    	});

    	return block;
    }

    // (39:27) 
    function create_if_block_4(ctx) {
    	let div;
    	let alum;
    	let div_transition;
    	let current;
    	alum = new Alum({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(alum.$$.fragment);
    			add_location(div, file$8, 39, 2, 938);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(alum, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alum.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alum.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(alum);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(39:27) ",
    		ctx
    	});

    	return block;
    }

    // (35:27) 
    function create_if_block_3(ctx) {
    	let div;
    	let aero;
    	let div_transition;
    	let current;
    	aero = new Aero({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(aero.$$.fragment);
    			add_location(div, file$8, 35, 2, 865);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(aero, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aero.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aero.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(aero);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(35:27) ",
    		ctx
    	});

    	return block;
    }

    // (31:28) 
    function create_if_block_2(ctx) {
    	let div;
    	let supra;
    	let div_transition;
    	let current;
    	supra = new Supra({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(supra.$$.fragment);
    			add_location(div, file$8, 31, 2, 791);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(supra, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(supra.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(supra.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(supra);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(31:28) ",
    		ctx
    	});

    	return block;
    }

    // (27:27) 
    function create_if_block_1$2(ctx) {
    	let div;
    	let baja;
    	let div_transition;
    	let current;
    	baja = new Baja({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(baja.$$.fragment);
    			add_location(div, file$8, 27, 2, 717);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(baja, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(baja.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(baja.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(baja);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(27:27) ",
    		ctx
    	});

    	return block;
    }

    // (23:1) {#if $page == 'home'}
    function create_if_block$4(ctx) {
    	let div;
    	let home;
    	let div_transition;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(home.$$.fragment);
    			add_location(div, file$8, 23, 2, 644);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(home, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(home);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(23:1) {#if $page == 'home'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let main;
    	let navbar;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	const if_block_creators = [
    		create_if_block$4,
    		create_if_block_1$2,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$page*/ ctx[0] == "home") return 0;
    		if (/*$page*/ ctx[0] == "baja") return 1;
    		if (/*$page*/ ctx[0] == "supra") return 2;
    		if (/*$page*/ ctx[0] == "aero") return 3;
    		if (/*$page*/ ctx[0] == "alum") return 4;
    		if (/*$page*/ ctx[0] == "spons") return 5;
    		if (/*$page*/ ctx[0] == "contact") return 6;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(main, "id", "docTop");
    			add_location(main, file$8, 20, 0, 588);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $page;
    	validate_store(page, "page");
    	component_subscribe($$self, page, $$value => $$invalidate(0, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Home,
    		Baja,
    		Supra,
    		Aero,
    		Alum,
    		Spons,
    		Contact,
    		Socials,
    		fade,
    		page,
    		data,
    		$page
    	});

    	return [$page];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    const app = new App( {
    	target: document.body,
    } );

    return app;

}());
