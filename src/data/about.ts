import {
  Lightbulb,
  Target,
  Users,
  Zap,
  Shield,
  Heart,
  LucideIcon,
} from "lucide-react"

// ============================================================================
// TYPES
// ============================================================================

export interface AboutStat {
  value: number
  suffix: string
  label: string
}

export interface MissionVisionItem {
  id: "mission" | "vision"
  title: string
  description: string
  icon: LucideIcon
}

export interface CoreValue {
  id: string
  title: string
  description: string
  icon: LucideIcon
  gridClass: string
}

export interface Milestone {
  year: string
  title: string
  description: string
  highlight?: boolean
}

export interface TeamMember {
  name: string
  role: string
  image: string
  bio: string
}

// ============================================================================
// HERO STATS - Animated counters
// ============================================================================

export const aboutStats: AboutStat[] = [
  { value: 10000, suffix: "+", label: "Khách hàng tin dùng" },
  { value: 5, suffix: "M+", label: "Trang đã dịch" },
  { value: 50, suffix: "+", label: "Ngôn ngữ hỗ trợ" },
  { value: 99.9, suffix: "%", label: "Độ chính xác" },
]

// ============================================================================
// MISSION & VISION
// ============================================================================

export const missionVision: MissionVisionItem[] = [
  {
    id: "mission",
    title: "Sứ mệnh",
    description:
      "Xoá bỏ rào cản ngôn ngữ trong công việc và học tập. Giúp mọi người tiếp cận tri thức toàn cầu một cách dễ dàng, nhanh chóng và chính xác.",
    icon: Target,
  },
  {
    id: "vision",
    title: "Tầm nhìn",
    description:
      "Trở thành nền tảng dịch thuật AI hàng đầu Đông Nam Á, nơi công nghệ phục vụ con người và kết nối các nền văn hoá khác nhau.",
    icon: Lightbulb,
  },
]

// ============================================================================
// CORE VALUES - Bento grid
// ============================================================================

export const coreValues: CoreValue[] = [
  {
    id: "innovation",
    title: "Đổi mới sáng tạo",
    description:
      "Không ngừng nghiên cứu và ứng dụng công nghệ AI tiên tiến nhất để nâng cao chất lượng dịch thuật.",
    icon: Zap,
    gridClass: "md:col-span-2",
  },
  {
    id: "quality",
    title: "Chất lượng hàng đầu",
    description:
      "Cam kết độ chính xác 99.9% và giữ nguyên định dạng tài liệu gốc.",
    icon: Shield,
    gridClass: "md:col-span-1",
  },
  {
    id: "customer",
    title: "Khách hàng là trọng tâm",
    description:
      "Lắng nghe, thấu hiểu và đồng hành cùng khách hàng trong mọi dự án dịch thuật.",
    icon: Heart,
    gridClass: "md:col-span-1",
  },
  {
    id: "teamwork",
    title: "Tinh thần đồng đội",
    description:
      "Xây dựng môi trường làm việc cởi mở, sáng tạo và hỗ trợ lẫn nhau để cùng phát triển.",
    icon: Users,
    gridClass: "md:col-span-2",
  },
]

// ============================================================================
// TIMELINE - Company journey
// ============================================================================

export const milestones: Milestone[] = [
  {
    year: "2021",
    title: "Khởi đầu hành trình",
    description:
      "AnyTrans ra đời từ ý tưởng đơn giản: dịch tài liệu PDF mà không làm mất format.",
  },
  {
    year: "2022",
    title: "1.000 người dùng đầu tiên",
    description:
      "Đạt mốc 1.000 khách hàng và ra mắt tính năng Glossary cho doanh nghiệp.",
    highlight: true,
  },
  {
    year: "2023",
    title: "Mở rộng thị trường",
    description:
      "Hỗ trợ 50+ ngôn ngữ, tích hợp OCR và ra mắt API cho developers.",
  },
  {
    year: "2024",
    title: "10.000 khách hàng",
    description:
      "Đạt mốc 10.000 khách hàng tin dùng và 5 triệu trang tài liệu đã dịch.",
    highlight: true,
  },
  {
    year: "2025",
    title: "Tương lai phía trước",
    description:
      "Tiếp tục đổi mới với AI thế hệ mới, hướng tới mục tiêu trở thành nền tảng dịch thuật #1 Đông Nam Á.",
  },
]

// ============================================================================
// TEAM MEMBERS
// ============================================================================

export const teamMembers: TeamMember[] = [
  {
    name: "Nguyễn Minh Nguyên",
    role: "Software Engineer",
    image: "/images/team/nguyen.jpg",
    bio: "Full-stack developer với niềm đam mê xây dựng các ứng dụng web hiệu năng cao và trải nghiệm người dùng mượt mà.",
  },
  {
    name: "Nguyễn Trọng Nhân",
    role: "Software Engineer",
    image: "/images/team/nhan.jpg",
    bio: "Chuyên gia về kiến trúc frontend và tối ưu hóa hệ thống, luôn tìm kiếm giải pháp công nghệ sáng tạo.",
  },
]
