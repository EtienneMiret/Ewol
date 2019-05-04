export enum Direction {
  X = 'x',
  Y = 'y'
}

export interface Wall {
  x: number;
  y: number;
  z: number;
  dir: Direction
}

export interface WorldMap {
  walls: Wall[];
}

const PASSIVE: AddEventListenerOptions = {
  once: true,
  passive: true
};

export function loadMap (successCallback: (m: WorldMap) => void): void {
  const xhr = new XMLHttpRequest ();
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      const map: WorldMap = JSON.parse(xhr.response);
      successCallback (map);
    }
  }, PASSIVE);
  xhr.open ('GET', 'map');
  xhr.setRequestHeader ('Accept', 'application/json');
  xhr.send ();
}
