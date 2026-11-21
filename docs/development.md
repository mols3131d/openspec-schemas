---
title: "Development Guide"
description: "OpenSpec 커스텀 스키마를 개발, 확장 및 유지보수하기 위한 표준 개발 가이드입니다."
---

# Development Guide

이 문서는 `openspec-schemas` 저장소에서 OpenSpec 커스텀 스키마를 새로 작성하거나 기존 스키마를 수정·확장할 때 따르는 개발 표준과 절차를 정의합니다.

## Schema Layout

각 커스텀 스키마는 `openspec/schemas/<schema-name>/` 디렉터리 아래에 위치하며, 다음과 같은 표준 구조를 유지해야 합니다.

```text
openspec/schemas/<schema-name>/
├── schema.yaml            # OpenSpec 스키마 정의 (Artifact DAG 및 Instructions)
├── README.md              # 스키마 개요, 워크플로우 및 사용법
├── docs/                  # 스키마 내부 아키텍처 및 유지보수 문서
│   ├── architecture.md    # 아키텍처, 워크플로우 DAG, 책임 분리 근거
│   ├── baseline.md        # 장기 보존 요구사항(R), 결정(D), 불변 조건(I)
│   └── README.md          # 스키마 문서 인덱스
└── templates/             # Artifact 생성용 Markdown 템플릿
    ├── proposal.md
    ├── spec.md
    └── ...
```

## Schema Definition Rules

`schema.yaml`은 OpenSpec runtime이 아티팩트의 생성 순서와 지침을 해석하는 핵심 설정 파일입니다.

### 1. Metadata

- `name`: 스키마 식별자 (kebab-case, e.g. `spec-driven-tdd`)
- `version`: 스키마 버전 정수 (e.g. `1`)
- `description`: 스키마의 핵심 목적과 워크플로우 요약

### 2. Artifact DAG (`artifacts`)

각 아티팩트는 명확한 입력 의존성(`requires`)과 생성 패턴(`generates`), 템플릿(`template`), 지침(`instruction`)을 정의합니다.

- **Artifact ID**: 소문자 식별자 (e.g. `proposal`, `specs`, `design`, `tasks`)
- **`requires`**: 선행 아티팩트 목록. 순환 의존성이 없어야 하며 최소한의 필수 선행 조건만 연결합니다.
- **`generates`**: 생성 파일 경로 또는 glob 패턴 (e.g. `proposal.md`, `specs/**/*.md`)
- **`instruction`**: 에이전트가 해당 아티팩트를 작성할 때 준수해야 하는 구체적인 작성 범위와 완료 조건

### 3. Execution Phase (`apply`)

- `requires`: `apply` 단계 시작에 필요한 선행 아티팩트 (일반적으로 `tasks`)
- `tracks`: 진행 상황을 추적할 대상 파일 (e.g. `tasks.md`)
- `instruction`: 구현 실행 시 에이전트가 따라야 할 작업 순서, 피드백 루프(TDD 등), 에러 대응 규칙

## Template Design & Parser Contracts

템플릿은 에이전트와 파서가 소통하는 인터페이스 역할을 합니다.

### Frontmatter Conventions

- 각 템플릿은 `type: openspec-<schema-name>-<artifact-type>` 형식의 고유 타입을 가집니다.
- 공통 메타데이터 필드(`title`, `description`)를 제공하며, 필요한 경우 `tags` 필드를 선언합니다.

### Parser & Semantic Boundaries

- **파서 고정 헤딩**: 파서가 구조를 인식하는 필수 헤딩(e.g. `## Capabilities`, `### Requirement:`, `#### Scenario:`, `## Tasks`)은 변경하지 않습니다.
- **체크박스 규칙**: Tasks 아티팩트에서 최상위 체크박스(`- [ ]`, `- [x]`)는 독립적으로 검증 가능한 구현 결과에만 사용합니다.
- **HTML 주석 작성 가이드**: 템플릿 상단에 주석(`<!-- ... -->`) 형태로 에이전트가 지켜야 할 작성 규칙, 섹션 생략 기준, 금지 사항을 명시합니다.

## Baseline & Architecture Governance

스키마의 지속 가능한 유지보수를 위해 모든 스키마는 설계 결정과 불변 조건을 명문화해야 합니다.

1. **Architecture ([architecture.md](../openspec/schemas/spec-driven-tdd/docs/architecture.md))**:
   - 아티팩트 간의 책임 분리(Responsibility Separation)
   - Mermaid 기반의 워크플로우 다이어그램
   - 설계 근거(Design Rationale) 및 계약 소유권(Contract Ownership)
2. **Baseline ([baseline.md](../openspec/schemas/spec-driven-tdd/docs/baseline.md))**:
   - **Requirements (R-xxx)**: 스키마가 충족해야 하는 불변의 요구사항
   - **Decisions (D-xxx)**: 설계 과정에서 채택된 결정과 배경 이유
   - **Invariants (I-xxx)**: 스키마 변경 시에도 절대 훼손되어서는 안 되는 제약
   - **Change Record**: 베이스라인 변경 내역 및 마이그레이션 정책

## Validation Checklist

스키마를 추가하거나 수정할 때는 다음 사항을 확인합니다.

- [ ] `schema.yaml`의 YAML 문법 유효성 및 아티팩트 DAG 순환 참조 여부
- [ ] 템플릿의 frontmatter 형식 및 파서 계약 헤딩 일치 여부
- [ ] 마크다운 린트 규칙 준수 (`.rumdl.toml` 설정 기준)
- [ ] `docs/baseline.md`의 Invariants 위반 여부 검토
- [ ] [language.md](language.md)의 언어 정책 준수 여부
