import { Colors } from "@/constants/Colors";

const COLORS = [
    Colors.light.purple, 
    Colors.light.teal, 
    Colors.light.yellow,
    Colors.light.pastelblue,
    Colors.light.stone,
    Colors.light.classygreen,
    Colors.light.skin,
    Colors.light.lightslate,
];

export function getRandomColor() {
    return COLORS[ Math.floor(Math.random() * (COLORS.length)) ];
}