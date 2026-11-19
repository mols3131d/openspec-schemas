# OpenSpec Schemas

에이전틱 개발 도구인 OpenSpec의 커스텀 스키마(Custom Schemas)를 생성하고 유지보수하는 저장소입니다.

## Goals

- 재사용 가능한 커스텀 스키마 유지보수

## Directory Structure

```text
openspec-schemas/
├── docs/
├── schemas/                   # OpenSpec 커스텀 스키마 모음
│   └── <schema-name>/
├── AGENTS.md
├── CHATBOT.md
└── README.md
```

## Schemas

| Schema | Description |
| --- | --- |
| [spec-driven-tdd](schemas/spec-driven-tdd/README.md) | OpenSpec의 Artifact 의존성을 활용해 변경 의도부터 TDD 호환 구현까지 연결하는 계획 스키마 |
