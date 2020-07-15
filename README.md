# A Wolf3D Tile Map Editor made with React

This is a small sample project I used for learning React and experimenting with Webassembly.

Try the [browser version](https://nhyarlathotep.github.io/Wolf3D-react-editor/) to play with it instantly or compile on your desktop!

![][image-1]

## Table of contents

* [Usage](#usage)
  * [Editor](#editor)
    * [Walls](#walls)
    * [Sprites](#sprites)
    * [Portals](#portals)
    * [Misc](#misc)
  * [Game](#game)

* [How to build](#how-to-build)

## Usage

### Editor

This is a tile editor where you can place the following tiles:

#### Walls

A wall can take different textures and can be placed anywhere on the grid.

##### Height

The height of the wall can be modified, it is between 0%(The wall is considered as a floor) and 100%(The wall is complete). 

In the editor, the height is represented by the number written on the walls. In game, The player or the sprites can go above these walls.

##### Thin

A wall can be defined as thin, which means that the wall will be in the middle of the block.
It can also be defined as a wall that can be pushed, in order to create secret walls in the game (the direction must be specified).

In the editor, it is represented by a red line or an arrow if the wall is pushable.

##### Doors

The doors are a certain type of thin walls, instead of being pushed the walls will slide to the side in order to open and close. The doors are the last two walls in the list.

#### Sprites

The sprites are objects or entities that are in the map, the player is part of these sprites, he is represented by the soldier that represents his spawn point, if it is not defined then he will appear in (x: 0, y: 0, z: 0)

#### Portals

It is possible to place connected portals, in order to differentiate them it is possible to change hue of each of them.
The player can pass through in order to be teleported to the other and vice versa.

#### Misc

##### Import/Export

It is possible to import or export maps in **Json** format. For inspiration and examples you can find two maps:

[The default level for the game](src/resources/defaultMap.json) and [the first level of the original game](src/resources/Wolf3dLevel_1.json).


![][image-2]

### Game

The game is written with Rust for WebAssembly, for more info check this [repository](https://github.com/Nhyarlathotep/Wolf3D-wasm). The application loads the files compiled from the branch build

| Controls      | Qwerty  | Azerty  |
| ------------- | ------- | ------- |
| Move Forward  | `W`     | `Z`     |
| Look Left     | `A`     | `Q`     |
| Move Backward | `S`     | `S`     |
| Look Right    | `D`     | `D`     |
| Jump          | `SPACE` | `SPACE` |
| Interact      | `F`     | `F`     |


## How to Build

To build the desktop or the browser version you need to install [npm](https://www.npmjs.com/) and use it:

### To install the dependencies:

```bash
npm install
```

### To run the app:

```bash
npm start
```

### With your own build of the  game

**Remove** this line from the dependencies in the [package.json](package.json):

```json
"wolf3D-wasm": "github:Nhyarlathotep/Wolf3D-wasm#build"
```

Then run `npm link` in your game build directory and run `npm link wolf3D-wasm ` in the root of the application.

[image-1]:	doc/anim.gif
[image-2]:	doc/editor.gif
