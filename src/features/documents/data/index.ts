import type { Language, Domain, Tone, Glossary, TranslationConfig } from "../types"

// =============== LANGUAGES ===============

export const languages: Language[] = [
  { code: "auto", name: "Tự động phát hiện" },
  { code: "en", name: "English" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
]

export const sourceLanguages = languages
export const targetLanguages = languages.filter((l) => l.code !== "auto")

// =============== DOMAINS ===============

export const domains: Domain[] = [
  { id: "general", name: "Tổng quát", icon: "📋" },
  { id: "tech", name: "Công nghệ", icon: "💻" },
  { id: "medical", name: "Y tế", icon: "⚕️" },
  { id: "legal", name: "Pháp lý", icon: "⚖️" },
  { id: "finance", name: "Tài chính", icon: "💰" },
  { id: "marketing", name: "Marketing", icon: "📢" },
]

// =============== TONES ===============

export const tones: Tone[] = [
  { id: "formal", name: "Trang trọng", description: "Phù hợp văn bản chính thức" },
  { id: "casual", name: "Thân mật", description: "Phù hợp giao tiếp hàng ngày" },
  { id: "professional", name: "Chuyên nghiệp", description: "Phù hợp môi trường công việc" },
  { id: "friendly", name: "Thân thiện", description: "Gần gũi, dễ hiểu" },
]

// =============== MOCK GLOSSARIES ===============

export const mockGlossaries: Glossary[] = [
  {
    id: "tech",
    name: "Công nghệ thông tin",
    terms: [
      { src: "API", tgt: "Giao diện lập trình ứng dụng" },
      { src: "Database", tgt: "Cơ sở dữ liệu" },
      { src: "Framework", tgt: "Khung làm việc" },
      { src: "Algorithm", tgt: "Thuật toán" },
      { src: "Interface", tgt: "Giao diện" },
      { src: "Server", tgt: "Máy chủ" },
      { src: "Client", tgt: "Máy khách" },
    ],
  },
  {
    id: "medical",
    name: "Y tế - Dược phẩm",
    terms: [
      { src: "Diagnosis", tgt: "Chẩn đoán" },
      { src: "Treatment", tgt: "Điều trị" },
      { src: "Prescription", tgt: "Đơn thuốc" },
      { src: "Symptom", tgt: "Triệu chứng" },
      { src: "Therapy", tgt: "Liệu pháp" },
      { src: "Patient", tgt: "Bệnh nhân" },
      { src: "Chronic", tgt: "Mãn tính" },
    ],
  },
]

// =============== MOCK CONTENT ===============

export const mockOriginalText = `Introduction to Modern Web Development

Web development has evolved significantly over the past decade. Modern frameworks and libraries have revolutionized how we build applications. The rise of component-based architecture has made development more modular and maintainable.

Key Concepts:
1. Single Page Applications (SPA)
2. Progressive Web Apps (PWA)
3. Server-Side Rendering (SSR)
4. Static Site Generation (SSG)

React, Vue, and Angular are among the most popular frameworks today. They provide powerful tools for building interactive user interfaces. TypeScript has also gained tremendous adoption, bringing type safety to JavaScript development.

Performance Optimization:
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Bundle size reduction

The modern web development ecosystem continues to grow with new tools and best practices emerging regularly. Staying updated with these changes is crucial for developers.`

export const mockTranslatedText = `Giới thiệu về Phát triển Web Hiện đại

Phát triển web đã phát triển đáng kể trong thập kỷ qua. Các framework và thư viện hiện đại đã cách mạng hóa cách chúng ta xây dựng ứng dụng. Sự phát triển của kiến trúc dựa trên thành phần đã làm cho việc phát triển trở nên module hóa và dễ bảo trì hơn.

Các Khái niệm Chính:
1. Ứng dụng Một Trang (SPA)
2. Ứng dụng Web Tiến bộ (PWA)
3. Kết xuất Phía Máy chủ (SSR)
4. Tạo Trang Tĩnh (SSG)

React, Vue và Angular là một trong những framework phổ biến nhất hiện nay. Chúng cung cấp các công cụ mạnh mẽ để xây dựng giao diện người dùng tương tác. TypeScript cũng đã được chấp nhận rộng rãi, mang lại tính an toàn kiểu cho phát triển JavaScript.

Tối ưu hóa Hiệu suất:
- Phân chia mã và tải chậm
- Tối ưu hóa hình ảnh
- Chiến lược bộ nhớ đệm
- Giảm kích thước bundle

Hệ sinh thái phát triển web hiện đại tiếp tục phát triển với các công cụ và phương pháp hay nhất mới xuất hiện thường xuyên. Cập nhật những thay đổi này là rất quan trọng đối với các nhà phát triển.`

// =============== DEFAULT CONFIG ===============

export const defaultConfig: TranslationConfig = {
  srcLang: "auto",
  tgtLang: "vi",
  domain: "general",
  tone: "professional",
  glossaryId: null,
  manualTerms: [],
}
