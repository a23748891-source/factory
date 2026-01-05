# 스타일 가이드

## 색상 팔레트

### 주요 색상
- **배경**: `#F3F4F9` (밝은 회색)
- **카드 배경**: `#FFFFFF` (흰색)
- **입력 필드 배경**: `#F6F7FA` (연한 회색)

### 포인트 색상
- **Primary (빨강)**: `#ED4B5E`
- **Primary Hover**: `#ff6678`
- **Secondary (보라)**: `#7369AB`
- **Link (핑크)**: `#EF7886`

### 보조 색상
- **Border**: `#E5E9F5`
- **Placeholder**: `#C0C7DB`
- **Text**: `#333333`

## 타이포그래피

### 폰트
```css
font-family: Verdana, Geneva, Tahoma, sans-serif;
```

### 크기
- **제목**: `2rem` ~ `2.2rem`
- **본문**: `1rem`
- **라벨**: `0.95rem`
- **버튼**: `1.2rem`

## 컴포넌트

### 버튼
```css
padding: 16px 75px;
background-color: #ED4B5E;
border-radius: 10px;
color: white;
font-size: 1.2rem;
```

**Hover 효과:**
```css
background-color: #ff6678;
```

### 입력 필드
```css
padding: 20px;
border: 1px solid #E5E9F5;
background-color: #F6F7FA;
border-radius: 10px;
```

**Focus 효과:**
```css
border-color: #ED4B5E;
background-color: white;
```

### 카드
```css
background: white;
border-radius: 8px;
box-shadow: 0 0 20px gainsboro;
padding: 50px;
```

### 라벨
```css
color: #7369AB;
font-weight: 500;
font-size: 0.95rem;
```

## 반응형 브레이크포인트

### 태블릿 (768px 이하)
- 패딩 축소
- 폰트 크기 조정
- 플렉스 방향 변경

### 모바일 (684px 이하)
- 더 작은 패딩
- 버튼 전체 너비
- 폰트 크기 추가 축소

### 작은 모바일 (480px 이하)
- 최소 패딩
- 최소 폰트 크기

## 애니메이션

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Hover 효과
```css
transition: all 0.3s;
transform: translateX(5px);
```

## 사용 예시

### 로그인/회원가입 폼
- 중앙 정렬 (`display: flex`, `justify-content: center`, `align-items: center`)
- 흰색 박스 (그림자 효과)
- 빨간색 제목
- 보라색 라벨
- 회색 입력 필드

### 홈 페이지
- 상단 네비게이션 바 (흰색)
- 컨텐츠 카드 (흰색, 그림자)
- 정보 아이템 (회색 배경, 보라색 테두리)

---

**일관성 있는 디자인으로 사용자 경험을 향상시킵니다! 🎨**

