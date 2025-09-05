import type { Route } from "./+types/home";
import { PromptGenerator } from "../components/promptGenerator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "プロンプト生成アプリ" },
    { name: "description", content: "8つの要素を入力して、効果的なプロンプトを自動生成します" },
  ];
}

export default function Home() {
  return <PromptGenerator />;
}
