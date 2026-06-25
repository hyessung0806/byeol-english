# 별 영어 (byeol-english)

초등 1학년 딸을 위한 **영어 학습 PWA** (별 시리즈). 알파벳·영어단어를 **그림·소리**와 함께
즐겁게 익힌다. 그림은 OpenMoji, 발음은 기기 내장 음성(Web Speech API).

- 배포(예정): https://hyessung0806.github.io/byeol-english/
- 단일 정적 사이트(빌드 없음). 외부 CDN 없음 — 그림(OpenMoji SVG)·아이콘만 번들.

## 기능
- 🔤 **알파벳** — A~Z, 글자 이름 + 파닉스(영어 단어 연상) + 예문 그림·발음
- 🍎 **단어** — 카테고리별 그림 카드(총 162개). **그림 → 🔊소리 → 철자** 순서로 점진 공개.
  (한글 뜻은 부모 모드에서 켜는 '한글 버전'에서만 마지막에 보임)
  - **하루 랜덤 노출:** 종류별로 하루 N개(기본 10)만 보여주고, 날짜가 바뀌면 다른 조합이 나옴(부모 모드에서 3~30 조절)
- 👂 **듣고 맞히기** — 발음 듣고 그림 고르기 / 그림 보고 단어 고르기 (전체 단어에서 출제)
- 🔐 **부모 모드**(제목 길게 누르기) — 한글 버전·하루 단어 수·소리/속도·영어 목소리·비번. 화면마다 ◀ **뒤로** 버튼으로 이전 화면 이동.
- (도장·점수 기능은 사용하지 않음 — 정답 시 ⭐별 효과만)

## 로컬에서 보기
빌드 없음. 이 폴더에서:
```bash
python3 -m http.server 8000
```
→ http://localhost:8000 (서비스워커·PWA·음성은 localhost 또는 https에서만 동작)

## 배포 (GitHub Pages)
1. 이 폴더를 깃 저장소로 만들어 원격 `hyessung0806/byeol-english`에 push
2. GitHub → Settings → Pages → Deploy from branch: `main` / `(root)`
3. 이후 `index.html`을 고쳐 push하면 sw.js가 네트워크 우선이라 **다음 실행 때 자동 반영**
   - ⚠️ `data/words.js`·`sw.js`·ASSETS를 바꾸면 sw 캐시 버전(`byeolenglish-vN`, 현재 v2)을 올려야 갱신됨

## 파일
- `index.html` — 앱 전체(HTML/CSS/JS)
- `data/words.js` — 단어·알파벳·카테고리 데이터 (여기만 고치면 내용 변경)
- `img/*.svg` — OpenMoji 그림 (CC BY-SA 4.0 · `LICENSES.md`)
- `manifest.json` · `sw.js` · `icon-*.png`

## 발음(음성) 메모
Web Speech API(기기 내장 TTS). 영어 voice가 없는 기기는 화면 글자로 안내(폴백).
파닉스 고립 음소(/æ/ 등)는 TTS 한계로, "A is for apple" 연상 + 화면 한글 근사음으로 대신함.
원하면 `audio/`에 26개 음소 mp3(엄마·아빠 목소리 가능)를 넣어 고도화할 수 있음(`CLAUDE.md` 참고).
