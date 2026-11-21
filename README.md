# OpenSpec Schemas

에이전틱 개발 도구인 OpenSpec의 커스텀 스키마(Custom Schemas)를 생성하고 유지보수하는 저장소입니다.

## Goals

- OpenSpec 표준 프로젝트 경로 `openspec/schemas/`에서 커스텀 스키마를 정의하고 검증
- 재사용 가능한 OpenSpec 커스터마이징 Skill의 작성 원본을 `src/skills/`에서 관리

## Directory Structure

```text
openspec-schemas/
├── openspec/
│   └── schemas/
│       └── spec-driven-tdd/
├── docs/
├── scripts/
├── src/
│   └── skills/              # 재사용 Skill의 관리 원본
├── AGENTS.md
├── CHATBOT.md
└── README.md
```

이 저장소의 스키마는 OpenSpec CLI가 프로젝트 스키마로 탐색합니다. 다른 저장소에서 사용하려면 스키마 디렉터리를 해당 프로젝트에 복사하거나 별도로 배포해야 합니다.

## Schemas

| Schema | Description |
| --- | --- |
| [spec-driven-tdd](openspec/schemas/spec-driven-tdd/README.md) | OpenSpec의 Artifact 의존성을 활용해 변경 의도부터 TDD 호환 구현까지 연결하는 계획 스키마 |

## Skills

- [mols-openspec-customize](src/skills/mols-openspec-customize/SKILL.md) — OpenSpec 커스터마이징 설계·검토·튜닝 Skill 및 [선택적 참조 문서](src/skills/mols-openspec-customize/references/).

이 Skill은 저장소에서 관리하는 재사용 원본으로, 로컬 에이전트에 자동 설치·활성화되지는 않습니다.

## Development harness

에이전트 지침은 [AGENTS.md](AGENTS.md), 챗 런타임 진입점은 [CHATBOT.md](CHATBOT.md), 도구 설치·검증은 [Development Tooling](docs/tooling.md)을 참고합니다.

```sh
mise install
mise run setup
mise run check
mise run schema-check
```

설치와 최초 Rulesync 동기화는 외부 다운로드·로컬 쓰기를 포함하므로 설정을 검토한 다음 실행합니다. `mise run schema-check`는 임시 OpenSpec 프로젝트에서 스키마를 검증합니다. 다른 저장소에 대한 배포는 별도로 확인해야 합니다.
