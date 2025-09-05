import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Copy, ChevronDown, HelpCircle } from "lucide-react"

const promptSchema = z.object({
  role: z.string().min(1, "役割は必須です"),
  task: z.string().min(1, "タスクは必須です"),
  context: z.string().min(1, "コンテキストは必須です"),
  outputFormat: z.string().min(1, "出力形式は必須です"),
  references: z.string().optional(),
  constraints: z.string().optional(),
  style: z.string().optional(),
  evaluationCriteria: z.string().optional(),
})

type PromptForm = z.infer<typeof promptSchema>

const helpTexts = {
  role: "AIにどういう立場・人格で対応してもらうか\n例: きれいなコードを書くシニアエンジニア、小学生にやさしく説明する先生",
  task: "AIに依頼したい作業や処理\n例: コードレビューを行う、教材を作成する、広告施策を提案する",
  context: "今の状況や背景情報\n例: TypeScript環境でreact-hook-formを使用している、小学4年生対象の授業で使用",
  outputFormat: "望ましい出力の形\n例: Markdownコードブロック、JSON、ストーリー形式",
  references: "補助的に使う情報\n例: 既存コード、広告レポート、教科書の図",
  constraints: "守ってほしい条件や禁止事項\n例: 200文字以内、専門用語禁止、冗長な処理は避ける",
  style: "出力のトーンや雰囲気\n例: カジュアルに、丁寧に、ビジネスカジュアル",
  evaluationCriteria: "出力が「良い」と判断できる基準\n例: 型エラーがないこと、具体的施策が3つ以上含まれていること、子供が理解できる表現になっていること"
}

function LabelWithHelp({ htmlFor, children, helpText, required = false }: {
  htmlFor: string
  children: React.ReactNode
  helpText: string
  required?: boolean
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Label htmlFor={htmlFor} className={required ? "text-red-500" : ""}>
        {children}
      </Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="whitespace-pre-line text-sm">{helpText}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export function PromptGenerator() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [isOptionalOpen, setIsOptionalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
  })

  const generatePrompt = (data: PromptForm) => {
    let prompt = `あなたは${data.role}です。
次のタスクを行って下さい: ${data.task}

以下を参考にしてタスクを遂行してください

## コンテキスト
${data.context}`

    if (data.references) {
      prompt += `

## 参照
${data.references}`
    }

    if (data.constraints) {
      prompt += `

## 制約
${data.constraints}`
    }

    prompt += `

## 出力形式
必ず以下の形式で出力してください: ${data.outputFormat}`

    if (data.style) {
      prompt += `

## 文体
${data.style}`
    }

    if (data.evaluationCriteria) {
      prompt += `

## 評価基準
出力は次の基準を満たしている必要があります:
${data.evaluationCriteria}`
    }

    setGeneratedPrompt(prompt)
  }

  const copyToClipboard = async () => {
    if (generatedPrompt) {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Modern Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="relative">
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Prompt
                </h1>
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mt-2">
                  Generator
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg blur opacity-20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              プロンプトエンジニアリングの8つの要素を組み合わせて、<br />
              <span className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                効果的なプロンプトを自動生成
              </span>
            </p>
            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(generatePrompt)} className="space-y-12">
            {/* 必須項目 - 2×2グリッド */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-3xl border border-white/20 dark:border-gray-800/20 p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">必</span>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    必須項目
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <LabelWithHelp htmlFor="role" helpText={helpTexts.role} required>
                Role (役割) *
              </LabelWithHelp>
              <Input
                id="role"
                placeholder="例: きれいなコードを書くシニアエンジニア"
                {...register("role")}
              />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <LabelWithHelp htmlFor="task" helpText={helpTexts.task} required>
                Task (タスク) *
              </LabelWithHelp>
              <Textarea
                id="task"
                placeholder="例: コードレビューを行う"
                rows={3}
                {...register("task")}
              />
              {errors.task && (
                <p className="text-red-500 text-sm mt-1">{errors.task.message}</p>
              )}
            </div>

            <div>
              <LabelWithHelp htmlFor="context" helpText={helpTexts.context} required>
                Context (コンテキスト) *
              </LabelWithHelp>
              <Textarea
                id="context"
                placeholder="例: TypeScript環境でreact-hook-formを使用している"
                rows={3}
                {...register("context")}
              />
              {errors.context && (
                <p className="text-red-500 text-sm mt-1">{errors.context.message}</p>
              )}
            </div>

            <div>
              <LabelWithHelp htmlFor="outputFormat" helpText={helpTexts.outputFormat} required>
                Output Format (出力形式) *
              </LabelWithHelp>
              <Textarea
                id="outputFormat"
                placeholder="例: Markdownコードブロック"
                rows={3}
                {...register("outputFormat")}
              />
              {errors.outputFormat && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.outputFormat.message}
                </p>
              )}
                </div>
                </div>
              </div>
            </div>

            {/* オプション項目 - アコーディオン */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 rounded-3xl border border-white/20 dark:border-gray-800/20 shadow-2xl overflow-hidden">
                <Collapsible open={isOptionalOpen} onOpenChange={setIsOptionalOpen}>
                  <CollapsibleTrigger asChild>
                    <div className="group cursor-pointer p-8 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">+</span>
                          </div>
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            オプション項目
                          </span>
                          <div className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
                            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                              カスタマイズ
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {isOptionalOpen ? "折りたたみ" : "展開"}
                          </div>
                          <ChevronDown
                            className={`w-6 h-6 text-purple-500 transition-all duration-300 group-hover:text-purple-600 ${
                              isOptionalOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-8 pb-8">
                      <div className="border-t border-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 mb-6"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <LabelWithHelp htmlFor="references" helpText={helpTexts.references}>
                  References (参照)
                </LabelWithHelp>
                <Textarea
                  id="references"
                  placeholder="例: 既存コード、広告レポート、教科書の図"
                  rows={3}
                  {...register("references")}
                />
              </div>

              <div>
                <LabelWithHelp htmlFor="constraints" helpText={helpTexts.constraints}>
                  Constraints (制約)
                </LabelWithHelp>
                <Textarea
                  id="constraints"
                  placeholder="例: 200文字以内、専門用語禁止、冗長な処理は避ける"
                  rows={3}
                  {...register("constraints")}
                />
              </div>

              <div>
                <LabelWithHelp htmlFor="style" helpText={helpTexts.style}>
                  Style (文体)
                </LabelWithHelp>
                <Input
                  id="style"
                  placeholder="例: カジュアルに、丁寧に、ビジネスカジュアル"
                  {...register("style")}
                />
              </div>

              <div>
                <LabelWithHelp htmlFor="evaluationCriteria" helpText={helpTexts.evaluationCriteria}>
                  Evaluation Criteria (評価基準)
                </LabelWithHelp>
                <Textarea
                  id="evaluationCriteria"
                  placeholder="例: 型エラーがないこと、具体的施策が3つ以上含まれていること"
                  rows={3}
                  {...register("evaluationCriteria")}
                />
                      </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* 生成ボタン */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                <Button 
                  type="submit" 
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105 hover:shadow-3xl"
                  size="lg"
                >
                  <span className="flex items-center gap-3">
                    ✨ プロンプトを生成する
                  </span>
                </Button>
              </div>
            </div>
          </form>

          {/* 結果表示エリア */}
          {generatedPrompt && (
            <div className="relative mt-12">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-3xl border border-white/20 dark:border-gray-800/20 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 p-6 border-b border-green-200/50 dark:border-green-800/50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✨</span>
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                        生成されたプロンプト
                      </h2>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl blur opacity-50"></div>
                      <Button
                        type="button"
                        onClick={copyToClipboard}
                        className="relative bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <span className="flex items-center gap-2">
                          <Copy size={16} />
                          {copied ? "コピー済み!" : "コピー"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl"></div>
                    <pre className="relative whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-mono p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                      {generatedPrompt}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}