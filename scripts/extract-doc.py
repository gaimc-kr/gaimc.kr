#!/usr/bin/env python3
"""교직원 폴더 제출 파일(hwp / hwpx / docx)의 본문 텍스트를 표준 출력으로 뽑는다.
사용: python3 -I scripts/extract-doc.py <파일>
 - .hwp  : 한글 5.0(OLE) — olefile 필요(pip install olefile). 배포용(암호) 문서는 지원하지 않음
 - .hwpx : 한글 HWPX(zip/XML)
 - .docx : Word — 문단과 표(행은 ' | '로 구분)를 문서 순서대로 출력, 내장 이미지 목록은 stderr
"""
import sys, re, html, zipfile, struct

def hwp(path):
    import olefile, zlib
    ole = olefile.OleFileIO(path)
    hdr = ole.openstream('FileHeader').read()
    flags = struct.unpack('<I', hdr[36:40])[0]
    if (flags >> 1) & 1:
        sys.exit('암호화된 HWP 문서는 읽을 수 없음')
    inline8 = {1,2,3,4,5,6,7,8,9,11,12,14,15,16,17,18,19,20,21,22,23}
    def para_text(data):
        out, i, n = [], 0, len(data)//2
        while i < n:
            c = struct.unpack_from('<H', data, i*2)[0]
            if c in inline8:
                if c == 9: out.append('\t')
                i += 8; continue
            if c < 32:
                if c in (10, 13): out.append('\n')
                i += 1; continue
            out.append(chr(c)); i += 1
        return ''.join(out)
    secs = sorted([e for e in ole.listdir() if e[0] == 'BodyText'], key=lambda e: int(e[1].replace('Section', '')))
    for e in secs:
        raw = ole.openstream(e).read()
        if flags & 1:
            raw = zlib.decompress(raw, -15)
        pos = 0
        while pos + 4 <= len(raw):
            h = struct.unpack_from('<I', raw, pos)[0]
            tag, size = h & 0x3FF, (h >> 20) & 0xFFF
            pos += 4
            if size == 0xFFF:
                size = struct.unpack_from('<I', raw, pos)[0]; pos += 4
            body = raw[pos:pos+size]; pos += size
            if tag == 67:  # HWPTAG_PARA_TEXT
                t = para_text(body).strip()
                if t: print(t)

def hwpx(path):
    z = zipfile.ZipFile(path)
    for n in sorted(n for n in z.namelist() if re.search(r'Contents/section\d+\.xml', n)):
        x = z.read(n).decode('utf-8', 'ignore')
        for p in re.findall(r'<hp:p\b.*?</hp:p>', x, re.S):
            t = ''.join(html.unescape(m) for m in re.findall(r'<hp:t[^>]*>(.*?)</hp:t>', p, re.S))
            t = re.sub(r'<[^>]+>', '', t).strip()
            if t: print(t)

def docx(path):
    z = zipfile.ZipFile(path)
    doc = z.read('word/document.xml').decode('utf-8', 'ignore')
    body = doc[doc.find('<w:body>'):]
    def text_of(el):
        out = ''
        for m in re.finditer(r'<w:t(?:\s[^>]*)?>(.*?)</w:t>|<w:tab/>|<w:br/>', el, re.S):
            s = m.group(0)
            out += '\t' if s == '<w:tab/>' else '\n' if s == '<w:br/>' else html.unescape(m.group(1))
        return out
    for m in re.finditer(r'<w:p\b[^>]*>.*?</w:p>|<w:tbl>.*?</w:tbl>', body, re.S):
        s = m.group(0)
        if s.startswith('<w:tbl>'):
            for r in re.findall(r'<w:tr\b.*?</w:tr>', s, re.S):
                cells = []
                for c in re.findall(r'<w:tc\b.*?</w:tc>', r, re.S):
                    ps = re.findall(r'<w:p\b[^>]*>.*?</w:p>', c, re.S)
                    cells.append(' / '.join(t for t in (text_of(p).strip() for p in ps) if t))
                print(' | '.join(cells))
            print()
        else:
            t = text_of(s).strip()
            if t: print(t)
    media = [n for n in z.namelist() if n.startswith('word/media/')]
    if media: print('[media]', media, file=sys.stderr)

if __name__ == '__main__':
    p = sys.argv[1]
    ext = p.lower().rsplit('.', 1)[-1]
    {'hwp': hwp, 'hwpx': hwpx, 'docx': docx}.get(ext, lambda _: sys.exit('지원하지 않는 형식: ' + ext))(p)
