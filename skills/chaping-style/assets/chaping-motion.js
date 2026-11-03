// 差评风动效模板（GSAP 3）。每个函数把动画加到传入的 timeline 的 at 时刻，
// 不自己播放，适配 HyperFrames 的"单一暂停时间线、可任意 seek"约定。
// 用法：const tl = gsap.timeline({ paused: true }); CP.window(tl, "#w1", 0, 4);

(function (global) {
  const IN = "power3.out";
  const OUT = "power2.in";

  const CP = {
    // M10 素材窗：窗口淡入 + 来源标签滑入 + 窗内缓推
    window(tl, root, at, dur) {
      const r = document.querySelector(root);
      tl.fromTo(r.querySelector(".cp-window"), { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: IN }, at)
        .fromTo(r.querySelector(".cp-window-src"), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: IN }, at + 0.15)
        .fromTo(r.querySelector(".cp-window > *"), { scale: 1 }, { scale: 1.06, duration: dur, ease: "none" }, at);
      return tl;
    },

    // M8 文件透视推进 + 荧光笔依次扫过
    doc(tl, root, at, dur) {
      const r = document.querySelector(root);
      tl.fromTo(r.querySelector(".cp-doc"), { scale: 1, x: 0 }, { scale: 1.08, x: -40, duration: dur, ease: "none" }, at);
      const av = r.querySelector(".cp-avatar");
      if (av) tl.fromTo(av, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: IN }, at + 0.1);
      r.querySelectorAll(".cp-hl").forEach((h, i) => {
        tl.to(h, { scaleX: 1, duration: 0.5, ease: "power1.inOut" }, at + 0.4 + i * 0.3);
      });
      return tl;
    },

    // M9 数据条生长：bars 为 [{sel, at}]，每根条在口播说到时长出，数值滚动
    bars(tl, root, at, bars, decimals = 2) {
      const r = document.querySelector(root);
      tl.fromTo(r.querySelector("h1"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: IN }, at);
      bars.forEach(({ sel, at: t }) => {
        const row = r.querySelector(sel);
        const bar = row.querySelector(".bar");
        const val = row.querySelector(".val");
        const target = parseFloat(val.dataset.value);
        const obj = { v: 0 };
        tl.fromTo(row, { opacity: 0 }, { opacity: 1, duration: 0.15 }, t)
          .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: IN }, t)
          .to(obj, { v: target, duration: 0.6, ease: IN, onUpdate: () => (val.textContent = obj.v.toFixed(decimals) + (val.dataset.suffix || "%")) }, t);
      });
      return tl;
    },

    // M3 标题卡：大字 110%→100% 淡入，整体缓推 3%
    titleCard(tl, root, at, dur = 2.5) {
      const r = document.querySelector(root);
      tl.fromTo(r.querySelector(".word"), { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: IN }, at)
        .fromTo(r, { scale: 1 }, { scale: 1.03, duration: dur, ease: "none" }, at);
      return tl;
    },

    // M1 号码瀑布：整体上移，指定行红条扫亮并弹出"不接"标签
    numbers(tl, root, at, dur, hitIndex = 1, hitAt = 0.5) {
      const r = document.querySelector(root);
      tl.fromTo(r.querySelector(".stack"), { y: 60 }, { y: -60, duration: dur, ease: "none" }, at);
      const row = r.querySelectorAll(".num")[hitIndex];
      tl.to(row.querySelector(".redbar"), { scaleX: 1, duration: 0.35, ease: IN }, at + hitAt)
        .fromTo(row.querySelector(".tag"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: IN }, at + hitAt + 0.25)
        .to(row, { color: "#fff", duration: 0.2 }, at + hitAt);
      return tl;
    },

    // M4 纸片图标：items 为 [{icon, line, tag, at}]，各自跟口播的名词出现
    paperIcons(tl, items) {
      items.forEach(({ icon, line, tag, at }) => {
        tl.fromTo(icon, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: IN }, at);
        if (line) {
          const el = document.querySelector(line);
          const len = el.getTotalLength ? el.getTotalLength() : 400;
          tl.fromTo(el, { strokeDashoffset: len, opacity: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: "power1.out" }, at + 0.1);
        }
        if (tag) tl.fromTo(tag, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: IN }, at + 0.3);
      });
      return tl;
    },

    // M4 收尾：所有图标飞向 target 中心并淡出，肖像弹出
    assemble(tl, iconsSel, portraitSel, at) {
      const target = document.querySelector(portraitSel).getBoundingClientRect();
      document.querySelectorAll(iconsSel).forEach((el, i) => {
        const b = el.getBoundingClientRect();
        tl.to(el, { x: target.x + target.width / 2 - (b.x + b.width / 2), y: target.y + target.height / 2 - (b.y + b.height / 2), scale: 0.4, opacity: 0, duration: 0.45, ease: OUT }, at + i * 0.04);
      });
      tl.fromTo(portraitSel, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: IN }, at + 0.4);
      return tl;
    },

    // M5 / M7 通用：一组元素按给定时刻依次弹出
    popIn(tl, sels, times, from = { y: 8, opacity: 0 }) {
      sels.forEach((s, i) => tl.fromTo(s, from, { x: 0, y: 0, opacity: 1, duration: 0.25, ease: IN }, times[i]));
      return tl;
    },

    // M6 竖向标签链：线往下延长，标签依次出现。pills 为 [{sel, y, at}]
    chain(tl, lineSel, pills) {
      pills.forEach(({ sel, y, at }) => {
        tl.to(lineSel, { height: y + 30, duration: 0.3, ease: IN }, at)
          .fromTo(sel, { x: -20, opacity: 0, top: y }, { x: 0, opacity: 1, top: y, duration: 0.25, ease: IN }, at + 0.15);
      });
      return tl;
    },

    // 主持人景别跳切：中景 1.0 ↔ 近景 1.2（同一素材，seek 安全的 set）
    punch(tl, hostSel, at, scale = 1.2, originY = "35%") {
      tl.set(hostSel, { scale, transformOrigin: `50% ${originY}` }, at);
      return tl;
    },
    unpunch(tl, hostSel, at) {
      tl.set(hostSel, { scale: 1 }, at);
      return tl;
    },

    // G 极简图形：信息气泡从图标后飞出，再被吸回（表示信息丢失）
    bubblesLost(tl, tileSel, bubbleSels, at) {
      const t = document.querySelector(tileSel).getBoundingClientRect();
      bubbleSels.forEach((s, i) => {
        tl.fromTo(s, { x: 0, y: 0, scale: 0.3, opacity: 0 }, { x: 80 + i * 30, y: -60 + i * 40, scale: 1, opacity: 1, duration: 0.3, ease: IN }, at + i * 0.12)
          .to(s, { x: 0, y: 0, scale: 0.2, opacity: 0, duration: 0.35, ease: OUT }, at + 1.2 + i * 0.08);
      });
      return tl;
    },

    // 字幕：cues 为 [{t, end, text}]。每条字幕一个子元素，用 set 切换可见性，前后 seek 都正确
    subtitles(tl, subSel, cues) {
      const box = document.querySelector(subSel);
      cues.forEach(({ t, end, text }) => {
        const s = document.createElement("div");
        s.textContent = text;
        s.style.position = "absolute";
        s.style.left = s.style.right = "0";
        s.style.visibility = "hidden";
        box.appendChild(s);
        tl.set(s, { visibility: "visible" }, t);
        if (end != null) tl.set(s, { visibility: "hidden" }, end);
      });
      return tl;
    },
  };

  global.CP = CP;
})(window);
