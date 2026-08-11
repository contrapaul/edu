/* Minimal scene manager.
   One scene is mounted at a time inside the stage. A scene is an object with
   mount(root, arg), and optionally unmount() and tick(dt). */

const registry = {};
let root = null;
let current = null;
let currentName = null;

export function register(name, scene){ registry[name] = scene; }
export function bindRoot(node){ root = node; }

export function go(name, arg){
  const next = registry[name];
  if(!next) throw new Error("no scene: " + name);

  if(current && current.unmount) current.unmount();
  root.innerHTML = "";
  root.className = "scene-root scene-" + name;

  current = next;
  currentName = name;
  current.mount(root, arg);

  // restart the CSS enter animation. Doing this with rAF would leave the room
  // invisible whenever a scene change lands while the tab is in the background.
  root.style.animation = "none";
  void root.offsetWidth;
  root.style.animation = "";
}

let last = performance.now();
function loop(t){
  requestAnimationFrame(loop);
  const dt = Math.min((t - last)/1000, 0.1);
  last = t;
  if(current && current.tick) current.tick(dt);
}
requestAnimationFrame(loop);
