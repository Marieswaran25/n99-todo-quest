import { COLORS } from "../../../server/src/types/colors";

function genRandom(max:number){
    const random = Math.floor(Math.random() * max)
    return random;
}

export function genRandomColor():string{
    const availableColors=Object.values(COLORS)
    const pickColor=availableColors[genRandom(availableColors.length)]
    return pickColor
}