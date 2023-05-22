import os


def generate_structure_txt():
  dirnames = []
  structures = []

  for pathname, dirs, files in os.walk('.'):
    if not pathname.endswith('\\'):
      pathname += '\\'
    if pathname.startswith('.\\node_modules\\'):
      continue
    if pathname.startswith('.\\.git\\'):
      continue
    if '.nuxt\\' in pathname:
      continue
    if '.output\\' in pathname:
      continue
    pathname = pathname[2:-1]
    if not pathname: continue
    dirnames.append(pathname)

  dirnames.sort()
  maxLevel = 0

  for dirname in dirnames:
    tab = ''
    level = dirname.count('\\') + 1
    for i in range(level):
      tab += '│   '
    tab = tab[:-4]
    tab += '├── '
    dirname = tab + dirname.split('\\')[-1]
    structures.append([c for c in dirname])
    if level > maxLevel:
      maxLevel = level

  for lvl in range(maxLevel):
    lvlLastItemLn = None
    idx = lvl * 4
    for ln in range(len(structures)):
      dirname = structures[ln]
      if idx >= len(dirname):
        continue
      if (dirname[idx] not in ['│', '├']):
        if lvlLastItemLn != None:
          structures[lvlLastItemLn][idx] = '└'
      if (dirname[idx] == '├'):
        lvlLastItemLn = ln
    if lvlLastItemLn != None:
      structures[lvlLastItemLn][idx] = '└'

  for lvl in range(maxLevel):
    idx = lvl * 4
    isEnd = False
    for ln in range(len(structures)):
      if idx >= len(structures[ln]):
        continue
      if structures[ln][idx] == '└':
        isEnd = True
      elif structures[ln][idx] == '│' and isEnd:
        structures[ln][idx] = ' '
      else:
        isEnd = False

  with open('structure.txt', mode='w+', encoding='utf-8') as f:
    f.write('\n'.join([''.join(ln) for ln in structures]))

def scripts_statistic():
  lines_statistics = {}
  length_statistics = {}

  for path, dirs, files in os.walk('.'):
    if not path.endswith('\\'):
      path += '\\'
    for file in files:
      fp = path + file
      if (fp.startswith('.\\node_modules\\')):
        if (not fp.startswith('.\\node_modules\\@cch137\\')):
          continue
      if (fp.startswith('.\\.git\\')):
        continue
      if (fp.endswith('.min.html')):
        continue
      if ('.nuxt\\' in fp):
        continue
      if ('.output\\' in fp):
        continue
      extname = fp.split('.')[-1]
      try:
        with open(fp, 'r', encoding='utf-8') as f:
          content = f.read()
          lines = content.split('\n').__len__()
          length = content.__len__()
          if extname not in lines_statistics:
            lines_statistics[extname] = 0
            length_statistics[extname] = 0
          lines_statistics[extname] += lines
          length_statistics[extname] += length
          # print(fp, lines, length)
      except Exception as err:
        print(fp, err)

  languages = 'ts vue js css scss html pug'
  lines_statistics = { key: lines_statistics[key] for key in lines_statistics if key in languages }
  length_statistics = { key: length_statistics[key] for key in length_statistics if key in languages }

  print('\nLENGTHS')
  total = sum([length_statistics[i] for i in length_statistics])
  for lang in length_statistics:
    print(f'{lang}\t{length_statistics[lang]}\t{round(length_statistics[lang] / total * 100, 2)}%')
  print(f'TOTAL\t{total}')

  print('\nLINES')
  total = sum([lines_statistics[i] for i in lines_statistics])
  for lang in lines_statistics:
    print(f'{lang}\t{lines_statistics[lang]}\t{round(lines_statistics[lang] / total * 100, 2)}%')
  print(f'TOTAL\t{total}')

generate_structure_txt()
scripts_statistic()