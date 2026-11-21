# OpenSpec Schemas

에이전틱 개발 도구인 OpenSpec의 커스텀 스키마(Custom Schemas)를 생성하고 유지보수하는 저장소입니다.

## Goals

- 재사용 가능한 스키마와 Skill 등 배포 가능한 자산의 원본을 [src/](src/README.md)에서 관리

## Directory Structure

```text
openspec-schemas/
├── docs/
├── src/                       # 다른 저장소에도 배포 가능한 자산의 원본
│   ├── schemas/               # OpenSpec 커스텀 스키마
│   │   └── <schema-name>/
│   └── skills/                # 재사용 가능한 Agent Skills
├── AGENTS.md
├── CHATBOT.md
└── README.md
```

`src/`의 배치만으로 외부 저장소에 자동 배포되지는 않습니다. 배포 방식과 대상은 별도로 정의합니다.

## Schemas

| Schema | Description |
| --- | --- |
| [spec-driven-tdd](src/schemas/spec-driven-tdd/README.md) | OpenSpec의 Artifact 의존성을 활용해 변경 의도부터 TDD 호환 구현까지 연결하는 계획 스키마 |

## Skills

- [mols-openspec-customize](src/skills/mols-openspec-customize/SKILL.md) — OpenSpec 커스터마이징의 설계·검토·튜닝용 재사용 Skill. [Reference](src/skills/mols-openspec-customize/references/)는 필요할 때 선택해 읽는다.

## Development harness

에이전트 지침은 [AGENTS.md](AGENTS.md), 챗 런타임 진입점은 [CHATBOT.md](CHATBOT.md), 도구 설치·검증은 [Development Tooling](docs/tooling.md)을 참고합니다.

```sh
mise install
mise run setup
mise run check
mise run schema-check
```

설치와 최초 Rulesync 동기화는 외부 다운로드·로컬 쓰기를 포함하므로 설정을 검토한 다음 실행합니다. `mise run schema-check`는 임시 OpenSpec 프로젝트에서 스키마를 검증한다. 실제 외부 저장소 배포와 Skill 로딩은 별도로 확인해야 한다.
