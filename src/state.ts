export const globalGameState: {
  scenes: string[];
  nextScene: string;
  setNextScene: (sceneName: string) => void;
} = {
  scenes: ["level-1", "level-2"],
  nextScene: "",
  setNextScene(sceneName: string) {
    if (this.scenes.includes(sceneName)) {
      this.nextScene = sceneName;
    }
  },
};
