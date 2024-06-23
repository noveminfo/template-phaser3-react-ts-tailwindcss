import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { MainMenu } from "./game/scenes/MainMenu";

function App() {
  // The sprite can only be moved in the MainMenu Scene
  const [canMoveSprite, setCanMoveSprite] = useState(true);

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

  const changeScene = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as MainMenu;

      if (scene) {
        scene.changeScene();
      }
    }
  };

  const moveSprite = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as MainMenu;

      if (scene && scene.scene.key === "MainMenu") {
        // Get the update logo position
        scene.moveLogo(({ x, y }) => {
          setSpritePosition({ x, y });
        });
      }
    }
  };

  const addSprite = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene;

      if (scene) {
        // Add more stars
        const x = Phaser.Math.Between(64, scene.scale.width - 64);
        const y = Phaser.Math.Between(64, scene.scale.height - 64);

        //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
        const star = scene.add.sprite(x, y, "star");

        //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
        //  You could, of course, do this from within the Phaser Scene code, but this is just an example
        //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
        scene.add.tween({
          targets: star,
          duration: 500 + Math.random() * 1000,
          alpha: 0,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  };

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Phaser.Scene) => {
    setCanMoveSprite(scene.scene.key !== "MainMenu");
  };

  return (
    <div
      id="app"
      className="w-full h-screen overflow-hidden flex justify-center items-center"
    >
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      <div>
        <div>
          <button
            className="w-[140px] m-[10px] p-[10px] bg-black text-white/85 border border-white/85 hover:border-[#0ec3c9] hover:text-[#0ec3c9] active:bg-[#0ec3c9] disabled:cursor-not-allowed disabled:border-white/30 disabled:text-white/30"
            onClick={changeScene}
          >
            Change Scene
          </button>
        </div>
        <div>
          <button
            disabled={canMoveSprite}
            className="w-[140px] m-[10px] p-[10px] bg-black text-white/85 border border-white/85 hover:border-[#0ec3c9] hover:text-[#0ec3c9] active:bg-[#0ec3c9] disabled:cursor-not-allowed disabled:border-white/30 disabled:text-white/30"
            onClick={moveSprite}
          >
            Toggle Movement
          </button>
        </div>
        <div className="mt-[10px] ml-[10px] text-[0.8em]">
          Sprite Position:
          <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
        </div>
        <div>
          <button
            className="w-[140px] m-[10px] p-[10px] bg-black text-white/85 border border-white/85 hover:border-[#0ec3c9] hover:text-[#0ec3c9] active:bg-[#0ec3c9] disabled:cursor-not-allowed disabled:border-white/30 disabled:text-white/30"
            onClick={addSprite}
          >
            Add New Sprite
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
