# 불필요한 폴더 정리 가이드

## 삭제할 폴더

다음 폴더들은 중복되므로 **수동으로 삭제**해주세요:

### 1. backend_python/
```
이유: Python 백엔드는 사용하지 않음 (Java Spring Boot 사용)
```

### 2. frontend/
```
이유: 기존 React 프론트엔드 (frontend_simple로 대체됨)
```

### 3. frontend_new/
```
이유: TypeScript 프론트엔드 (frontend_simple로 대체됨)
```

## Windows에서 삭제 방법

```
1. 파일 탐색기에서 factory_complete 폴더 열기
2. 위의 3개 폴더를 선택
3. Delete 키 누르기 또는 우클릭 > 삭제
```

## PowerShell에서 삭제 방법

```powershell
cd C:\Users\a2374\Downloads\factory_complete

# 폴더 삭제 (주의: 복구 불가능)
Remove-Item -Recurse -Force backend_python
Remove-Item -Recurse -Force frontend
Remove-Item -Recurse -Force frontend_new
```

## 최종 프로젝트 구조

삭제 후 다음과 같은 구조가 됩니다:

```
factory_complete/
├── backend/           # ✅ Spring Boot (유지)
├── frontend_simple/   # ✅ React 프론트엔드 (유지)
├── README.md          # ✅ 간단한 설명
├── SIMPLE_README.md   # ✅ 상세 가이드
└── .gitignore         # ✅ Git 설정
```

---

**정리 후 프로젝트가 훨씬 간단해집니다! 🎉**

