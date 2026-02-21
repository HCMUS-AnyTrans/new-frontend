import { Star, Users, FileText, Clock, LucideIcon } from "lucide-react"

// ============================================================================
// TYPES
// ============================================================================

export interface Testimonial {
  name: string
  role: string
  company: string
  industry: string
  avatar: string
  content: string
  rating: number
}

export interface Stat {
  icon: LucideIcon
  label: string
  value: string
}

// ============================================================================
// TESTIMONIALS DATA - Source of Truth
// ============================================================================

export const testimonials: Testimonial[] = [
  {
    name: "Nguyễn Văn Minh",
    role: "CEO",
    company: "TechViet Solutions",
    industry: "Công nghệ",
    avatar: "NM",
    content:
      "AnyTrans đã giúp team chúng tôi tiết kiệm hàng chục giờ mỗi tuần. Chất lượng dịch thuật vượt xa mong đợi, đặc biệt với tài liệu kỹ thuật.",
    rating: 5,
  },
  {
    name: "Trần Thị Hương",
    role: "Giám đốc dịch vụ",
    company: "Legal Partners",
    industry: "Pháp lý",
    avatar: "TH",
    content:
      "Tính năng glossary chuyên ngành là game-changer. Các thuật ngữ pháp lý được dịch chính xác và nhất quán trong toàn bộ hợp đồng 200 trang.",
    rating: 5,
  },
  {
    name: "Lê Quang Huy",
    role: "Giám đốc nghiên cứu",
    company: "SciPub Vietnam",
    industry: "Xuất bản",
    avatar: "LH",
    content:
      "Dịch luận văn khoa học 300 trang trước đây mất cả tuần. Với AnyTrans, chúng tôi hoàn thành trong chưa đầy 1 giờ với tất cả công thức và biểu đồ được giữ nguyên hoàn hảo.",
    rating: 5,
  },
  {
    name: "Phạm Thị Mai",
    role: "Content Manager",
    company: "EduGlobal",
    industry: "Giáo dục",
    avatar: "PM",
    content:
      "Dịch tài liệu học thuật cần độ chính xác cao. AnyTrans không chỉ nhanh mà còn giữ nguyên các công thức và biểu đồ phức tạp.",
    rating: 5,
  },
  {
    name: "Đặng Minh Tuấn",
    role: "Product Owner",
    company: "FinTech Corp",
    industry: "Tài chính",
    avatar: "DT",
    content:
      "API integration mượt mà, documentation rõ ràng. Đã tích hợp vào hệ thống nội bộ trong vòng 2 ngày. Highly recommended!",
    rating: 5,
  },
  {
    name: "Vũ Hoàng Anh",
    role: "Operations Director",
    company: "Manufacturing Plus",
    industry: "Sản xuất",
    avatar: "VA",
    content:
      "Dịch technical manual 500 trang chỉ trong 30 phút với format hoàn hảo. Đội ngũ hỗ trợ cực kỳ chuyên nghiệp.",
    rating: 5,
  },
]

// ============================================================================
// STATS DATA
// ============================================================================

export const stats: Stat[] = [
  { icon: Star, label: "Đánh giá trung bình", value: "4.9/5" },
  { icon: Users, label: "Người dùng hài lòng", value: "10K+" },
  { icon: FileText, label: "Tài liệu đã dịch", value: "5M+" },
  { icon: Clock, label: "Uptime", value: "99.9%" },
]

// ============================================================================
// AVATAR COLORS
// ============================================================================

export const avatarColors = [
  "bg-primary",
  "bg-secondary-600",
  "bg-success",
  "bg-info",
  "bg-accent",
  "bg-destructive",
]
