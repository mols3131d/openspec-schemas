# Chatbot Instructions

`CHATBOT.md`는 chatbot harness를 repository guidance와 Agent Assets에 연결하는 최소 bootstrap이다. 정책, Skill 또는 Rule 본문은 여기서 소유하지 않는다.

## Context

| Path | Description |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | 모든 작업에서 읽는다. Project guidance의 root entrypoint이며 기본 context와 추가 context 탐색을 안내한다. |
| `**/AGENTS.md` | Repository path를 읽거나 변경하기 전에 root부터 target까지 적용되는 파일을 읽는다. Scoped guidance를 소유하며, 충돌하면 target에 가까운 지침을 우선하고 target이 바뀌면 다시 계산한다. |

## GitHub State

현재 GitHub 상태가 판단에 영향을 줄 때 GitHub plugin으로 live state를 확인한다.

## Boundary

Repository guidance와 platform/runtime guidance는 각자의 scope에만 적용한다. 서로의 authority를 재정의하거나 platform-specific behavior를 명시적인 요청 없이 repository policy로 영구 반영하지 않는다.
