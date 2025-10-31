import { DanmakuAlignment, DanmakuOptions, ManagerOptions, DanmakuManager } from "@evqovs/danmaku";
import { load_font, load_text, random_duration, to_px, to_px_value } from "./danmaku_helper";

interface PerformanceOptions extends ManagerOptions {
    font_name?: string;
    font_size?: string;
    danmaku: Promise<DanmakuOptions[]>;
    duration: () => number;
}

const task1: PerformanceOptions = {
    font_name: 'Sofia',
    font_size: to_px('3vh'),
    track_height: to_px_value('8vh'),
    min_horizontal_gap: to_px_value('8vw'),
    min_vertical_gap: to_px_value('4vh'),
    max_launch_count_per_tick: 16,
    max_row_count: 100,
    alignment: 'center' as DanmakuAlignment,
    interval: 100,
    danmaku: get_task1_danmaku(),
    duration: () => random_duration(14000, 18000),
}

const image_task = {
    track_height: to_px_value('20vh'),
    min_horizontal_gap: to_px_value('8vw'),
    min_vertical_gap: to_px_value('4vh'),
    max_launch_count_per_tick: 16,
    max_row_count: 100,
    alignment: 'center' as DanmakuAlignment,
    interval: 100,
    danmaku: get_image_danmaku(),
    duration: () => random_duration(10000, 14000),
}

const task3: PerformanceOptions = {
    font_name: 'Aref Ruqaa',
    font_size: to_px('3vh'),
    track_height: to_px_value('8vh'),
    min_horizontal_gap: to_px_value('8vw'),
    min_vertical_gap: to_px_value('4vh'),
    max_launch_count_per_tick: 16,
    max_row_count: 100,
    alignment: 'center' as DanmakuAlignment,
    interval: 100,
    danmaku: get_task3_danmaku(),
    duration: () => random_duration(14000, 18000),
}

async function get_task1_danmaku(): Promise<DanmakuOptions[]> {
    const ret: DanmakuOptions[] = [];
    const list = (await load_text('/assets/to_toto.txt')).split('\n');
    for (const text of list) {
        ret.push({
            duration: task1.duration(),
            node: [document.createTextNode(text)],
            style: {
                fontFamily: task1.font_name,
                fontSize: task1.font_size,
                maxHeight: task1.track_height + 'px',
                color: '#f0eaff',
                border: '1.5px solid #b8aaff',
                background: 'rgba(240, 240, 255, 0.08)',
                textShadow: '0 0 10px #d6ccff',
                boxShadow: '0 0 18px rgba(180, 160, 255, 0.25)',
                padding: '10px 20px',
                borderRadius: '20px',
            },
            loop: false,
            direction: 'to_left',
            clone_node: false,
        })
    }
    return ret;
}

async function get_image_danmaku(): Promise<Promise<DanmakuOptions>[]> {
    const ret: Promise<DanmakuOptions>[] = [];
    const list = (await load_text('/assets/img_src.txt')).split('\n');
    for (const url of list) {
        ret.push(new Promise(async res => {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxHeight = image_task.track_height - 4 + 'px';
            img.style.display = 'block';
            await img.decode();
            res({
                duration: image_task.duration(),
                node: [img],
                style: {
                    boxSizing: 'border-box',
                    maxHeight: image_task.track_height + 'px',
                    border: '2px solid #a07040',
                },
                loop: false,
                direction: 'to_left',
                clone_node: false,
            });

        }));
    }
    return ret;
}

async function get_task3_danmaku(): Promise<DanmakuOptions[]> {
    const ret: DanmakuOptions[] = [];
    const list = (await load_text('/assets/quran.txt')).split('\n');
    for (const text of list) {
        ret.push({
            duration: task3.duration(),
            node: [document.createTextNode(text)],
            style: {
                fontFamily: task3.font_name,
                fontSize: task3.font_size,
                fontWeight: 'bold',
                color: '#fff7ea',
                background: 'linear-gradient(180deg, #2b2f33 0%, #1f2428 100%)',
                border: '2px solid #c9a84b',
                borderRadius: '10px',
                padding: '10px 20px',
                boxSizing: 'border-box',
                boxShadow: '0 6px 18px rgba(15,18,20,0.55), 0 0 8px rgba(201,168,75,0.20)',
                textShadow: '0 1px 0 rgba(0,0,0,0.6), 0 0 6px rgba(201,168,75,0.12)',
                maxHeight: task3.track_height + 'px',
            },
            loop: false,
            direction: 'to_right',
            clone_node: false,
        })
    }
    return ret;
}

async function perform_image_danmaku(container: HTMLDivElement) {
    const manager = new DanmakuManager(image_task);
    manager.mount(container);
    manager.start_render();
    for (let d of await image_task.danmaku) {
        manager.push(await d);
    }
    const ro = new ResizeObserver(() => manager.resize());
    ro.observe(document.body);

    await manager.until_all_done();
    manager.unmount();
    ro.disconnect();
}

async function perform(options: PerformanceOptions, container: HTMLDivElement) {
    const manager = new DanmakuManager(options);
    manager.mount(container);
    manager.push(await options.danmaku);
    manager.start_render();
    const ro = new ResizeObserver(() => manager.resize());
    ro.observe(document.body);

    await manager.until_all_done();
    manager.unmount();
    ro.disconnect();
}

async function main() {
    await load_font(task1.font_name!, task1.font_size!);
    await load_font(task3.font_name!, task3.font_size!);

    const container: HTMLDivElement | null = document.getElementById('danmaku-container') as HTMLDivElement | null;
    if (!container) {
        throw new Error("Can't find the danmaku-container.");
    }

    await perform(task1, container);
    await transform_background('linear-gradient(135deg, #fff8f0 0%, #f5ebdc 100%)', '100% 0%');
    await perform_image_danmaku(container);
    await transform_background('radial-gradient(circle at 50% 20%, rgba(201, 168, 75, 0.04), transparent 20%), linear-gradient(180deg, #0f1214 0%, #1b1f22 100%)', '0% 0%');
    await perform(task3, container);
}

async function transform_background(background: string, origin: string): Promise<void> {
    return new Promise(res => {
        const div = document.createElement('div');
        Object.assign(div.style, {
            'background': background,
            'inset': '0',
            'clipPath': `circle(0% at ${origin})`,
            'transition': 'clip-path 4s ease-out',
            'zIndex': '999',
            'position': 'absolute',
        } as Partial<CSSStyleDeclaration>);
        div.addEventListener('transitionend', () => {
            document.body.style.background = background;
            div.remove();
            res();
        });
        document.body.appendChild(div);
        void div.offsetWidth;
        requestAnimationFrame(() => div.style.clipPath = `circle(150% at ${origin})`);
    });
}

await main();