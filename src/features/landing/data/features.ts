import {
  FileCheck,
  BookOpen,
  Zap,
  Eye,
  ScanLine,
  PiggyBank,
  LucideIcon,
} from "lucide-react"

// ============================================================================
// TYPES
// ============================================================================

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
  highlights: string[]
  iconBg: string
  titleColor: string
  titleBg: string
  visual: "format" | "glossary" | "speed" | "review" | "ocr" | "savings"
}

// ============================================================================
// FEATURES DATA - Source of Truth
// ============================================================================

export const features: Feature[] = [
  {
    icon: FileCheck,
    title: "Giữ nguyên format gốc",
    description:
      "Bảng biểu, hình ảnh, header/footer được bảo toàn hoàn hảo. Xuất file đúng định dạng ban đầu.",
    highlights: ["Giữ nguyên bảng biểu", "Bảo toàn hình ảnh", "Định dạng PDF/Word"],
    iconBg: "bg-primary",
    titleColor: "text-primary",
    titleBg: "bg-primary/10",
    visual: "format",
  },
  {
    icon: BookOpen,
    title: "Glossary thông minh",
    description:
      "Tạo và quản lý bộ từ điển chuyên ngành. Đảm bảo thuật ngữ nhất quán trong toàn bộ tài liệu.",
    highlights: ["Từ điển chuyên ngành", "Thuật ngữ nhất quán", "Tự động áp dụng"],
    iconBg: "bg-secondary-600",
    titleColor: "text-secondary-600",
    titleBg: "bg-secondary/20",
    visual: "glossary",
  },
  {
    icon: Zap,
    title: "Nhanh gấp 10 lần",
    description:
      "Xử lý tài liệu 50 trang chỉ trong vài phút. Tiết kiệm hàng giờ làm việc mỗi ngày.",
    highlights: ["50 trang/2 phút", "Xử lý batch", "Real-time progress"],
    iconBg: "bg-destructive",
    titleColor: "text-destructive",
    titleBg: "bg-destructive/10",
    visual: "speed",
  },
  {
    icon: Eye,
    title: "Review song ngữ",
    description:
      "Giao diện 2 cột cho phép so sánh bản gốc và bản dịch. Chỉnh sửa trực tiếp dễ dàng.",
    highlights: ["So sánh song ngữ", "Edit inline", "Track changes"],
    iconBg: "bg-info",
    titleColor: "text-info",
    titleBg: "bg-info/10",
    visual: "review",
  },
  {
    icon: ScanLine,
    title: "OCR hình ảnh",
    description:
      "Nhận diện và dịch văn bản trong hình ảnh. Hỗ trợ scan tài liệu chất lượng cao.",
    highlights: ["Nhận diện chữ in", "Scan tài liệu", "Độ chính xác 99%"],
    iconBg: "bg-primary",
    titleColor: "text-primary",
    titleBg: "bg-primary/10",
    visual: "ocr",
  },
  {
    icon: PiggyBank,
    title: "Tiết kiệm 80% chi phí",
    description:
      "Chi phí chỉ bằng 1/5 so với thuê dịch giả. ROI rõ ràng ngay từ tháng đầu tiên.",
    highlights: ["Giá từ 0.001$/từ", "Không phí ẩn", "Hoàn tiền 30 ngày"],
    iconBg: "bg-success",
    titleColor: "text-success",
    titleBg: "bg-success/10",
    visual: "savings",
  },
]
