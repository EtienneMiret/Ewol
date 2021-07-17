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

    describe ('isCloseToWall', () => {

      let map: WorldMap;

      beforeEach (() => {
        map = new WorldMap ({
          walls: [
            {x: 0, y: 0, z: 0, dir: Direction.X},
            {x: 0, y: 0, z: 0, dir: Direction.Y}
          ]
        })
      });

      describe ('(basic)', () => {

        it ('should say no in the middle of a tile', () => {
          expect (map.isCloseToWall (0.5, 0.5, 0)).toBeFalsy ();
        });

        it ('should say yes on a wall', () => {
          expect (map.isCloseToWall (0, 0.5, 0)).toBeTruthy ();
        });

      });

      describe ('(close to edge)', () => {

        it ('should say no on an empty edge', () => {
          expect (map.isCloseToWall (1, 0.5, 0)).toBeFalsy ();
        })

        it ('should say yes in front of a wall', () => {
          expect (map.isCloseToWall (0.5, 0.01, 0)).toBeTruthy ();
        });

        it ('should say no in front of an empty edge', () => {
          expect (map.isCloseToWall (0.5, 1.01, 0)).toBeFalsy ();
        });

        it ('should say yes back of a wall', () => {
          expect (map.isCloseToWall (0.5, -0.01, 0)).toBeTruthy ();
        });

        it ('should say no back of an empty edge', () => {
          expect (map.isCloseToWall (0.5, 0.99, 0)).toBeFalsy ();
        });

        it ('should say yes right of a wall', () => {
          expect (map.isCloseToWall (0.01, 0.5, 0)).toBeTruthy ();
        });

        it ('should say no right of an empty edge', () => {
          expect (map.isCloseToWall (1.01, 0.5, 0)).toBeFalsy ();
        });

        it ('should say yes left of a wall', () => {
          expect (map.isCloseToWall (-0.01, 0.5, 0)).toBeTruthy ();
        });

        it ('should say no left of an empty edge', () => {
          expect (map.isCloseToWall (0.99, 0.5, 9)).toBeFalsy ();
        });

      });

    });

  });

});
