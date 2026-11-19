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

## Development harness

에이전트 지침은 [AGENTS.md](AGENTS.md), 챗 런타임 진입점은 [CHATBOT.md](CHATBOT.md), 도구 설치·검증은 [Development Tooling](docs/tooling.md)을 참고합니다.

```sh
mise install
mise run setup
mise run check
```

설치와 최초 Rulesync 동기화는 외부 다운로드·로컬 쓰기를 포함하므로 설정을 검토한 다음 실행합니다. `mise run check`는 정적 도구 검사이며 OpenSpec 런타임 검증을 대신하지 않습니다.
