import { Direction, Edge, WorldMap } from '../../main/ts/load-map';

describe ('load-map', () => {

  describe ('WorldMap', () => {

    describe ('constructor', () => {

      it ('should create empty map', () => {
        const map = new WorldMap({
          walls: []
        });

        expect (map.walls.length).toBe (0);
        expect (map['tiles'].length).toBe (0);
      });

      it ('should create single square map', () => {
        const map = new WorldMap({
          walls: [
            {x: 0, y: 0, z: 0, dir: Direction.X},
            {x: 0, y: 0, z: 0, dir: Direction.Y},
            {x: 1, y: 0, z: 0, dir: Direction.Y}
          ]
        });

        expect (map.walls.length).toBe (3);
        expect (map.getTile (0, 0, 0).forward).toBe (Edge.Open);
        expect (map.getTile (0, 1, 0).backward).toBe (Edge.Open);
        expect (map.getTile (0, 0, 0).backward).toBe (Edge.Walled);
        expect (map.getTile (0, -1, 0).forward).toBe (Edge.Walled);
        expect (map.getTile (0, 0, 0).right).toBe (Edge.Walled);
        expect (map.getTile (1, 0, 0).left).toBe (Edge.Walled);
        expect (map.getTile (0, 0, 0).left).toBe (Edge.Walled);
        expect (map.getTile (-1, 0, 0).right).toBe(Edge.Walled);
      });

    });

  });

});
