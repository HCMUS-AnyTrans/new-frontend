"use client"

import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Glossary, ManualTerm } from "../types"

interface GlossarySectionProps {
  glossaries: Glossary[]
  selectedGlossaryId: string | null
  manualTerms: ManualTerm[]
  onGlossaryChange: (glossaryId: string | null) => void
  onAddManualTerm: () => void
  onUpdateManualTerm: (id: string, field: "src" | "tgt", value: string) => void
  onRemoveManualTerm: (id: string) => void
}

export function GlossarySection({
  glossaries,
  selectedGlossaryId,
  manualTerms,
  onGlossaryChange,
  onAddManualTerm,
  onUpdateManualTerm,
  onRemoveManualTerm,
}: GlossarySectionProps) {
  const selectedGlossary = glossaries.find((g) => g.id === selectedGlossaryId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Glossary (Bảng thuật ngữ)</CardTitle>
        <CardDescription>Thêm thuật ngữ chuyên ngành để dịch chính xác hơn</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="select" className="w-full">
          <TabsList variant="line" className="mb-6 w-full">
            <TabsTrigger value="select" className="flex-1">
              Chọn từ Glossary
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-1">
              Thêm thủ công
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <div className="mb-4">
              <Label className="mb-2 block">Chọn bảng thuật ngữ</Label>
              <Select
                value={selectedGlossaryId || "none"}
                onValueChange={(v) => onGlossaryChange(v === "none" ? null : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn glossary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không sử dụng</SelectItem>
                  {glossaries.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name} ({g.terms.length} thuật ngữ)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedGlossary && (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Từ gốc
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Bản dịch
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGlossary.terms.slice(0, 5).map((term, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="px-4 py-3 text-sm text-foreground">{term.src}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{term.tgt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                  Hiển thị 5/{selectedGlossary.terms.length} thuật ngữ
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual">
            <div className="space-y-3">
              {manualTerms.map((term) => (
                <div key={term.id} className="flex gap-3">
                  <Input
                    placeholder="Từ gốc"
                    value={term.src}
                    onChange={(e) => onUpdateManualTerm(term.id, "src", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Bản dịch"
                    value={term.tgt}
                    onChange={(e) => onUpdateManualTerm(term.id, "tgt", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveManualTerm(term.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={onAddManualTerm}
                disabled={manualTerms.length >= 20}
              >
                <Plus className="size-4" />
                Thêm thuật ngữ {manualTerms.length > 0 && `(${manualTerms.length}/20)`}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
