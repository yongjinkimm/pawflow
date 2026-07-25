# 🐾 PawFlow

> Pet Care Workflow for Jira built with Atlassian Forge

PawFlow는 반려동물 병원, 펫샵 등에서 반복적으로 수행되는 케어 업무를  
**Jira Issue와 연결된 표준 체크리스트로 관리하는 Atlassian Forge 앱**입니다.

반려동물마다 달라질 수 있는 업무 수행 절차를 표준화하고, 케어 유형별 진행 상태를 Jira 안에서 관리하는 것을 목표로 합니다.

---

## 1. 프로젝트 개요

반려동물 병원이나 펫샵에서는 건강검진, 예방접종, 미용 등 반복적인 케어 업무가 발생합니다.

하지만 담당자마다 업무 수행 순서나 확인 항목이 달라질 경우 누락이 발생하거나 진행 상태를 파악하기 어려울 수 있습니다.

PawFlow는 Jira Issue 안에서 반려동물을 선택하고 케어 유형별 체크리스트를 수행하도록 하여 이러한 업무를 표준화합니다.

### 주제 선정 이유

본 과제에서는 단순한 CRUD 애플리케이션보다 Jira와 Forge의 특성을 활용할 수 있는 업무 프로세스를 구현하고자 했습니다.

반려동물 병원이나 펫샵의 건강검진, 예방접종, 미용 등의 업무는 반복적으로 수행되며, 담당자에 따라 확인 절차가 달라질 수 있습니다.

이러한 반복 업무를 Jira Issue와 연결된 체크리스트로 관리하면 기존 Jira의 업무 관리 기능을 유지하면서 Forge를 통해 도메인별 업무 프로세스를 확장할 수 있다고 판단했습니다.

따라서 **반려동물 케어 업무의 표준화**를 주제로 선정하고, Jira Issue를 하나의 업무 단위로 활용하는 PawFlow를 설계했습니다.

### 핵심 흐름

```text
Jira Issue
   │
   ▼
PawFlow
   │
   ├── 반려동물 관리
   │     ├── 등록
   │     └── 수정
   │
   └── 케어 업무
         │
         ├── 반려동물 선택
         ├── 케어 유형 선택
         ├── 체크리스트 수행
         └── 진행 상태 저장
```

---

## 2. 해결하고자 한 문제

반복적인 반려동물 케어 업무에서 다음과 같은 문제를 정의했습니다.

- 담당자마다 업무 수행 절차가 달라질 수 있음
- 반복 업무에서 확인 항목이 누락될 수 있음
- 업무 진행 상태를 별도로 관리해야 함
- 반려동물별 작업 이력을 구분하기 어려움
- 기존 업무 관리 도구와 케어 프로세스가 분리될 수 있음

PawFlow는 별도의 업무 시스템을 만드는 대신 **Jira의 Issue를 업무 단위로 활용하고 Forge 앱을 통해 케어 프로세스를 확장**하는 방향으로 설계했습니다.

---

## 3. 주요 기능

### 반려동물 관리

반려동물의 기본 정보를 등록하고 수정할 수 있습니다.

관리 정보:

- 종류
- 이름
- 보호자명
- 연락처
- 특이사항

### 케어 업무

등록된 반려동물을 선택하고 케어 유형에 따른 표준 체크리스트를 수행할 수 있습니다.

현재 제공하는 케어 유형:

- 건강검진
- 예방접종
- 미용

### 진행 상태 관리

체크리스트 완료 상태를 기반으로 진행률을 계산합니다.

```text
○ 시작 전
● 진행 중
✓ 케어 완료
```

진행률과 완료 항목 수, 마지막 저장 시간을 확인할 수 있습니다.

### 업무별 데이터 분리

케어 업무는 다음 조합을 기준으로 독립적으로 저장됩니다.

```text
Jira Issue + Pet + Care Type
```

예를 들어 다음 세 업무는 각각 별도의 상태를 가집니다.

```text
SCRUM-1 / 베베 / 건강검진
SCRUM-1 / 베베 / 예방접종
SCRUM-1 / 코코 / 건강검진
```

따라서 다른 반려동물이나 케어 유형으로 이동한 뒤 다시 돌아와도 이전 진행 상태를 복원할 수 있습니다.

---

## 4. 사용자 흐름

### Home

PawFlow의 시작 화면입니다.

현재 Jira Issue, 등록된 반려동물 수와 현재 선택된 업무의 진행 상태를 확인하고 다음 작업을 선택할 수 있습니다.

```text
Home
 ├── 케어 업무 시작
 └── 반려동물 관리
```

### Pet Management

반려동물을 등록하고 기존 정보를 조회하거나 수정합니다.

### Care Workflow

```text
반려동물 선택
      ↓
케어 유형 선택
      ↓
저장된 업무 조회
      ↓
체크리스트 수행
      ↓
진행률 계산
      ↓
Forge Storage 저장
```

---

## 5. 기술 스택

| 영역 | 기술 |
|---|---|
| Platform | Atlassian Forge |
| Product | Jira Cloud |
| Frontend | React |
| UI | Forge UI Kit |
| Backend | Forge Resolver |
| Storage | Forge KVS |
| Runtime | Node.js |
| Package Manager | npm |
| Version Control | Git / GitHub |
| Development | Visual Studio Code |

---

## 6. 아키텍처

PawFlow는 Jira Issue Panel에서 실행되는 Forge 앱입니다.

```text
┌─────────────────────────────┐
│         Jira Cloud          │
│                             │
│  Jira Issue                 │
│      │                      │
│      ▼                      │
│  PawFlow Issue Panel        │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│       Forge UI Kit          │
│                             │
│ Home                        │
│ PetManager                  │
│ CareChecklist               │
└─────────────┬───────────────┘
              │ invoke()
              ▼
┌─────────────────────────────┐
│       Forge Resolver        │
│                             │
│ getPets                     │
│ createPet                   │
│ updatePet                   │
│ getCareTask                 │
│ saveCareTask                │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│          Forge KVS          │
│                             │
│ Pet Data                    │
│ Care Task Data              │
└─────────────────────────────┘
```

프론트엔드는 `@forge/bridge`의 `invoke()`를 통해 Resolver를 호출하며, Resolver가 데이터 조회 및 저장을 담당합니다.

---

## 7. 프로젝트 구조

```text
pawflow/
├── src/
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── PetManager.jsx
│   │   │   └── CareChecklist.jsx
│   │   │
│   │   ├── data/
│   │   │   └── checklistTemplates.js
│   │   │
│   │   ├── utils/
│   │   │   └── petUtils.js
│   │   │
│   │   └── index.jsx
│   │
│   ├── resolvers/
│   │   └── index.js
│   │
│   └── index.js
│
├── manifest.yml
├── package.json
├── package-lock.json
└── README.md
```

### 주요 역할

`Home.jsx`  
앱 시작 화면 및 현재 업무 현황 표시

`PetManager.jsx`  
반려동물 등록, 조회 및 수정

`CareChecklist.jsx`  
반려동물 및 케어 유형 선택, 체크리스트 수행과 진행률 표시

`checklistTemplates.js`  
케어 유형별 표준 체크리스트 정의

`petUtils.js`  
반려동물 관련 옵션 및 공통 유틸리티

`resolvers/index.js`  
Forge KVS와 연결되는 백엔드 로직

---

## 8. 데이터 저장 구조

반려동물 데이터는 Forge KVS에 저장합니다.

케어 업무는 Jira Issue, 반려동물, 케어 유형의 조합으로 키를 생성합니다.

```javascript
care-task-${issueKey}-${petId}-${careType}
```

이를 통해 하나의 Jira Issue 안에서도 반려동물과 케어 유형에 따라 독립적인 업무 상태를 유지할 수 있습니다.

---

## 9. 설치 및 실행

### 요구 환경

- Node.js
- npm
- Git
- Atlassian 계정
- Jira Cloud 사이트
- Forge CLI

### 의존성 설치

```bash
npm install
```

### Forge 로그인

```bash
forge login
```

### 코드 검사

```bash
forge lint
```

### Development 배포

```bash
forge deploy
```

### Jira 사이트 설치

최초 설치 시:

```bash
forge install
```

설치 후 Jira Issue에서 PawFlow Issue Panel을 사용할 수 있습니다.

---

## 10. 구현 범위

현재 MVP에서 구현한 기능:

- Jira Issue Panel 연동
- Jira Issue Context 활용
- 반려동물 등록
- 반려동물 조회
- 반려동물 정보 수정
- 케어 대상 선택
- 케어 유형 선택
- 유형별 체크리스트 제공
- 체크 항목 완료/해제
- 진행률 계산
- 업무 상태 표시
- 마지막 저장 시간 표시
- Forge KVS 데이터 저장
- 반려동물/케어 유형별 업무 상태 분리 및 복원

---

## 11. 미구현 범위 및 개선 방향

MVP에서는 핵심 업무 흐름 검증에 집중하여 다음 기능은 구현 범위에서 제외했습니다.

- 반려동물 삭제
- 사용자 및 권한 관리
- 검색 및 필터링
- 전체 케어 업무 통계
- 케어 이력 타임라인
- 사용자 정의 체크리스트
- Jira Workflow 자동 연동
- 알림 기능

향후에는 체크리스트 완료 시 Jira Issue 상태를 자동 변경하거나, 케어 결과를 Jira Activity 또는 Comment와 연결하는 방식으로 확장할 수 있습니다.

---

## 12. AI 활용

프로젝트 개발 과정에서 AI를 보조 도구로 활용했습니다.

주요 활용 범위:

- 아이디어 구체화 및 문제 정의
- Forge 개발환경 구축 과정 지원
- 프로젝트 구조 설계
- 코드 작성 및 리팩터링 보조
- 오류 원인 분석 및 디버깅
- UI/UX 개선 방향 검토
- 문서 구조 및 README 작성 지원

AI가 제안한 결과를 그대로 사용하는 방식이 아니라, 실제 Forge/Jira 환경에서 실행 및 검증하면서 오류를 수정하고 요구사항에 맞게 구조를 변경하는 방식으로 활용했습니다.

---

## 13. 구현 목표

PawFlow의 목표는 완전한 동물병원 관리 시스템을 구현하는 것이 아닙니다.

**Jira와 Atlassian Forge를 활용하여 반복적인 실무 프로세스를 어떻게 표준화하고 기존 Jira 업무 흐름 안에 자연스럽게 통합할 수 있는지 보여주는 것**을 핵심 목표로 했습니다.