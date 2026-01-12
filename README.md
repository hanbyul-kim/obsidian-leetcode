# Obsidian LeetCode Importer Plugin

Obsidian에서 LeetCode 문제를 쉽게 가져오고 정리할 수 있는 플러그인입니다. LeetCode URL을 입력하면 문제 정보를 파싱하여 frontmatter가 포함된 마크다운 노트로 자동 생성합니다.

## 주요 기능

- 🔗 **URL 입력으로 간편한 임포트**: LeetCode 문제 URL만 입력하면 자동으로 파싱
- 📝 **Frontmatter 메타데이터**: 문제 번호, 난이도, 태그, 승인률 등을 frontmatter에 자동 저장
- 💻 **다중 언어 코드 템플릿**: Python, Java, C++, JavaScript, TypeScript 등 주요 언어의 코드 템플릿 포함
- 📂 **자동 폴더 정리**: 설정한 폴더에 자동으로 문제 노트 생성
- 🎨 **마크다운 변환**: HTML 형식의 문제 설명을 읽기 쉬운 마크다운으로 자동 변환

## 설치 방법

### 수동 설치

1. 이 저장소를 클론하거나 다운로드합니다
2. `npm install` 실행
3. `npm run build` 실행
4. `main.js`, `manifest.json`, `styles.css` 파일을 Obsidian vault의 `.obsidian/plugins/obsidian-leetcode/` 폴더에 복사

## 사용 방법

### 1. 리본 아이콘 사용

- 좌측 리본 메뉴에서 코드 아이콘 클릭
- LeetCode URL 입력
- "Import" 버튼 클릭

### 2. 명령 팔레트 사용

1. `Ctrl/Cmd + P`로 명령 팔레트 열기
2. "Import LeetCode Problem" 검색
3. LeetCode URL 입력
4. Enter 또는 "Import" 버튼 클릭

### 3. 지원하는 URL 형식

```
https://leetcode.com/problems/two-sum/
https://leetcode.com/problems/two-sum/description/
https://leetcode.com/problems/add-two-numbers/
```

## 생성되는 노트 구조

```markdown
---
title: "Two Sum"
leetcode_id: 1
difficulty: Easy
tags: ["Array", "Hash Table"]
acceptance_rate: 49.50%
url: "https://leetcode.com/problems/two-sum/"
date_created: 2026-01-12
status: "todo"
---

# 1. Two Sum

> [!info] Problem Information
> - **Difficulty:** Easy
> - **Tags:** Array, Hash Table
> - **Acceptance Rate:** 49.50%
> - **Link:** [LeetCode](https://leetcode.com/problems/two-sum/)

## Problem Description

[문제 설명이 마크다운 형식으로 표시됩니다]

## Hints

[힌트가 있는 경우 표시됩니다]

## Solution

### Approach

<!-- Describe your approach here -->

### Complexity Analysis

- Time Complexity:
- Space Complexity:

### Code

#### Python3

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:

```

#### Java

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {

    }
}
```

## Notes

<!-- Add your notes here -->
```

## 설정

플러그인 설정 탭에서 다음을 설정할 수 있습니다:

- **Folder Path**: LeetCode 문제가 저장될 폴더 (기본값: `LeetCode`)
- **Include Hints**: 힌트를 노트에 포함할지 여부 (기본값: 활성화)
- **Default Status**: 새 문제의 기본 상태 (기본값: `todo`)

## Frontmatter 필드

생성된 노트의 frontmatter에는 다음 필드가 포함됩니다:

| 필드 | 설명 | 예시 |
|------|------|------|
| `title` | 문제 제목 | "Two Sum" |
| `leetcode_id` | 문제 번호 | 1 |
| `difficulty` | 난이도 | Easy, Medium, Hard |
| `tags` | 문제 태그 | ["Array", "Hash Table"] |
| `acceptance_rate` | 승인률 | 49.50% |
| `url` | LeetCode 문제 링크 | https://leetcode.com/... |
| `date_created` | 생성 날짜 | 2026-01-12 |
| `status` | 문제 상태 | todo, in-progress, completed |

## Dataview 활용 예시

Dataview 플러그인과 함께 사용하면 LeetCode 문제를 효과적으로 관리할 수 있습니다:

### 난이도별 문제 목록

```dataview
TABLE difficulty, tags, acceptance_rate
FROM "LeetCode"
SORT difficulty ASC, leetcode_id ASC
```

### 미완료 문제 목록

```dataview
TABLE leetcode_id, title, difficulty
FROM "LeetCode"
WHERE status = "todo"
SORT difficulty ASC
```

### 태그별 문제 통계

```dataview
TABLE length(rows) as Count
FROM "LeetCode"
FLATTEN tags
GROUP BY tags
SORT Count DESC
```

## 개발

### 빌드

```bash
npm install
npm run build
```

### 개발 모드

```bash
npm run dev
```

## 기술 스택

- TypeScript
- Obsidian API
- LeetCode GraphQL API

## 라이선스

0-BSD License

## 기여

이슈나 풀 리퀘스트는 언제나 환영합니다!

## 알려진 제한사항

- LeetCode의 GraphQL API를 사용하므로 네트워크 연결이 필요합니다
- 일부 프리미엄 문제는 가져올 수 없을 수 있습니다
- HTML to Markdown 변환이 완벽하지 않을 수 있습니다

## 로드맵

- [ ] 프리미엄 문제 지원
- [ ] 문제 검색 기능
- [ ] 태그별 필터링
- [ ] Daily Challenge 자동 가져오기
- [ ] 제출 내역 관리
- [ ] 진행률 대시보드
