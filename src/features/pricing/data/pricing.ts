import {
  FileText,
  FileCheck,
  Presentation,
  BookOpen,
  LucideIcon,
} from "lucide-react"

// ============================================================================
// TYPES
// ============================================================================

export interface Plan {
  id: string
  name: string
  credits: string
  price: string
  originalPrice?: string
  unitPrice: string
  savings?: string
  popular: boolean
  checkoutUrl: string
}

export interface PlanFeature {
  text: string
  included: boolean
}

export interface UsageExample {
  icon: LucideIcon
  labelKey: string
  credits: number
}

export interface FeatureComparisonRow {
  feature: string
  starter: boolean | string
  popular: boolean | string
  pro: boolean | string
}

export interface FAQItem {
  question: string
  answer: string
}

// ============================================================================
// PRICING PLANS - Source of Truth
// ============================================================================

export const pricingPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: "100.000",
    price: "99.000",
    unitPrice: "~1đ",
    popular: false,
    checkoutUrl: "/checkout?plan=starter",
  },
  {
    id: "popular",
    name: "Popular",
    credits: "500.000",
    price: "399.000",
    unitPrice: "~0.8đ",
    savings: "Tiết kiệm 20%",
    popular: true,
    checkoutUrl: "/checkout?plan=popular",
  },
  {
    id: "pro",
    name: "Pro",
    credits: "2.000.000",
    price: "999.000",
    unitPrice: "~0.5đ",
    savings: "Tiết kiệm 50%",
    popular: false,
    checkoutUrl: "/checkout?plan=pro",
  },
]

// ============================================================================
// USAGE EXAMPLES - For pricing page
// ============================================================================

export const usageExamples: UsageExample[] = [
  { icon: FileText, labelKey: "pdf10", credits: 10 },
  { icon: FileCheck, labelKey: "contract50", credits: 50 },
  { icon: Presentation, labelKey: "ppt100", credits: 100 },
  { icon: BookOpen, labelKey: "thesis", credits: 80 },
]

// ============================================================================
// FEATURE COMPARISON - For pricing page table
// ============================================================================

export const featureComparison: FeatureComparisonRow[] = [
  { feature: "Giữ nguyên format", starter: true, popular: true, pro: true },
  { feature: "Glossary", starter: "Cơ bản", popular: "Nâng cao", pro: "Không giới hạn" },
  { feature: "OCR hình ảnh", starter: false, popular: true, pro: true },
  { feature: "Review song ngữ", starter: false, popular: true, pro: true },
  { feature: "API access", starter: false, popular: false, pro: true },
  { feature: "Hỗ trợ", starter: "Email", popular: "Ưu tiên", pro: "24/7" },
  { feature: "Team access", starter: false, popular: false, pro: true },
]

// ============================================================================
// FAQ - For pricing page
// ============================================================================

export const pricingFAQ: FAQItem[] = [
  {
    question: "Credit có hết hạn không?",
    answer: "Không. Credits không có ngày hết hạn, bạn có thể dùng bất kỳ lúc nào.",
  },
  {
    question: "Tôi dùng cho team được không?",
    answer: "Có. Gói Pro hỗ trợ team access, hoặc liên hệ Enterprise để được tư vấn giải pháp phù hợp.",
  },
  {
    question: "PDF 200 trang thì tốn bao nhiêu credit?",
    answer: "200 credits. Mỗi trang = 1 credit, tính theo số trang thực tế của tài liệu.",
  },
  {
    question: "API tính credit như thế nào?",
    answer: "Mỗi trang qua API = 1 credit, giống như sử dụng giao diện web.",
  },
  {
    question: "Có hoàn tiền không?",
    answer: "Credits không hoàn tiền, nhưng bạn có thể dùng thử miễn phí trước khi mua.",
  },
]

// ============================================================================
// ENTERPRISE FEATURES - For Enterprise block
// ============================================================================

export const enterpriseFeatures = [
  "Giảm giá lên đến 40%",
  "SLA cam kết",
  "Hỗ trợ 24/7 dedicated",
  "Tích hợp tùy chỉnh",
]
