# Kế hoạch Responsive Dashboard cho Mobile

## Tổng quan

Dashboard hiện dùng breakpoints Tailwind: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px). Kế hoạch này tập trung vào màn hình nhỏ (< 640px) và tablet (640–1024px).

---

## 1. Dashboard Page Layout

### Hiện trạng
- Grid `xl:grid-cols-12` cho Recent Jobs (8 cols) + Usage Panel (4 cols)
- Dưới xl: 1 cột (stack dọc)

### Đề xuất
| Breakpoint | Layout |
|-----------|--------|
| **&lt; sm** | Stack dọc: Recent Jobs → Usage Panel. Padding `px-4`, gap `gap-4` |
| **sm–xl** | Giữ stack dọc (Recent Jobs full width, Usage Panel full width) |
| **xl+** | Grid 8+4 như hiện tại |

**Thay đổi**: Thêm `gap-4 sm:gap-6` cho grid, đảm bảo `overflow-x-hidden` trên page tránh scroll ngang.

---

## 2. Header (Greeting + Quick Actions)

### Hiện trạng
- `flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`
- QuickActions: 2 nút (Upload, Buy Credits)

### Đề xuất
| Breakpoint | Thay đổi |
|-----------|----------|
| **Mobile** | Greeting 1 dòng ngắn, font `text-lg`. QuickActions: nút full-width hoặc icon-only cho Buy Credits |
| **sm+** | Giữ layout hiện tại |

**Cụ thể**:
- Greeting: `text-lg sm:text-xl sm:text-2xl` (đã có)
- QuickActions mobile: `flex-col w-full sm:flex-row sm:w-auto` — 2 nút stack dọc trên mobile
- Hoặc: Upload full width, Buy Credits icon-only (`size="icon"`) trên mobile

---

## 3. Stats Cards

### Hiện trạng
- `grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4`
- Mobile: 2x2 grid

### Đề xuất
| Breakpoint | Thay đổi |
|-----------|----------|
| **Mobile** | Giữ 2x2. Giảm padding `p-3`, font value `text-lg sm:text-xl` |
| **sm+** | Giữ như hiện tại |

**Cụ thể**:
- Padding: `p-3 sm:p-4 md:p-6` (đã có)
- Trend badge: `text-[10px] sm:text-xs` trên mobile
- Icon: `h-8 w-8 sm:h-12 sm:w-12` (đã có)

---

## 4. Recent Jobs Table

### Hiện trạng
- 5 cột: File Name, Languages (hidden sm+), Status, Credits, Actions
- `overflow-x-auto` trên wrapper

### Đề xuất
| Breakpoint | Cột hiển thị |
|-----------|--------------|
| **&lt; sm** | File Name, Status, Actions (3 cột). Ẩn Languages, Credits |
| **sm+** | Đủ 5 cột |

**Cụ thể**:
- Thêm `compact` variant cho mobile: `compact={true}` khi `isMobile`, hoặc thêm prop `columns` trong HistoryTable
- Hoặc: Credits `hidden xs:table-cell` (cần breakpoint tùy chỉnh)
- Table: `min-w-[320px]` hoặc `min-w-0` cho cell để truncate đúng

**Lưu ý**: Cần cập nhật `HistoryTable` để hỗ trợ ẩn Languages + Credits trên mobile khi compact. Hiện compact chỉ ẩn Created At.

---

## 5. Usage Panel

### Hiện trạng
- Credit + Storage trong 1 card
- Pie chart `h-[100px] sm:h-[120px]`, max-w

### Đề xuất
| Breakpoint | Thay đổi |
|-----------|----------|
| **Mobile** | Chart nhỏ hơn `h-[80px] sm:h-[100px]`. Storage: 1 dòng, font nhỏ |
| **sm+** | Giữ như hiện tại |

**Cụ thể**:
- Chart: `h-[80px] max-w-[140px] sm:h-[100px] sm:max-w-[180px]`
- Storage: `text-sm sm:text-base` cho số liệu

---

## 6. Jobs Chart (Activity Overview)

### Hiện trạng
- `h-[140px] sm:h-[160px] md:h-[180px]`
- `useIsMobile` cho tick interval, font size

### Đề xuất
| Breakpoint | Thay đổi |
|-----------|----------|
| **Mobile** | Giữ 140px. Tick interval `interval={1}` (đã có). XAxis label font nhỏ hơn |
| **sm+** | Giữ như hiện tại |

**Cụ thể**:
- YAxis width: `width={isMobile ? 24 : 40}` để tiết kiệm không gian
- `tickCount={isMobile ? 3 : 6}`

---

## 7. Payment Status Banner

### Hiện trạng
- Alert full width

### Đề xuất
- Mobile: `px-3 py-2`, text `text-sm`
- Nút Dismiss: `size="sm"` trên mobile

---

## 8. History Table (Recent Jobs compact)

### Cần bổ sung
- Khi compact + mobile: ẩn Languages, Credits → chỉ File Name, Status, Actions
- Cập nhật `HistoryTable` để nhận `isMobile` hoặc `hideOnMobile?: ('languages' | 'credits')[]`

---

## 9. Thứ tự ưu tiên triển khai

1. **Cao**: Recent Jobs table – ẩn Languages + Credits trên mobile (compact mode)
2. **Cao**: Quick Actions – stack dọc trên mobile
3. **Trung bình**: Usage Panel – thu nhỏ chart trên mobile
4. **Trung bình**: Stats Cards – tinh chỉnh padding/font
5. **Thấp**: Jobs Chart – tinh chỉnh YAxis
6. **Thấp**: Payment Banner – padding nhỏ hơn

---

## 10. Breakpoint tùy chỉnh (nếu cần)

Nếu cần `xs` (480px) giữa default và sm:

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      // ...
    },
  },
}
```

---

## 11. Đã triển khai (responsive)

- [x] Recent Jobs: ẩn Languages + Credits trên mobile (< sm)
- [x] Quick Actions: stack dọc full-width trên mobile
- [x] Usage Panel: chart nhỏ hơn (h-80, max-w-140) trên mobile
- [x] Stats Cards: gap nhỏ hơn, font value responsive
- [x] Jobs Chart: YAxis width 24, tickCount 3 trên mobile
- [x] Payment Banner: px-3 py-2 trên mobile

## 12. Kiểm tra

- [ ] Test trên viewport 375px (iPhone SE)
- [ ] Test trên viewport 390px (iPhone 14)
- [ ] Test trên viewport 768px (tablet)
- [ ] Không scroll ngang
- [ ] Touch target ≥ 44px cho nút
- [ ] Table horizontal scroll mượt khi cần
