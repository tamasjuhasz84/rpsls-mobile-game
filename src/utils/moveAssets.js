import rockIcon from "@/assets/icons/moves/rock.svg";
import paperIcon from "@/assets/icons/moves/paper.svg";
import scissorsIcon from "@/assets/icons/moves/scissors.svg";
import lizardIcon from "@/assets/icons/moves/lizard.svg";
import spockIcon from "@/assets/icons/moves/spock.svg";

export const MOVE_ICON_ASSETS = {
  rock: rockIcon,
  paper: paperIcon,
  scissors: scissorsIcon,
  lizard: lizardIcon,
  spock: spockIcon,
};

export function getMoveAsset(move) {
  return MOVE_ICON_ASSETS[move] || "";
}
