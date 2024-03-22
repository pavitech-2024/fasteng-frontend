import * as XLSX from 'xlsx';
import { dsvFormat } from 'd3-dsv';

export const processFile = async (file: FileList | Blob) => {
  if ((file as FileList)[0]?.type === 'application/vnd.ms-excel') {
    const fileList = file as FileList;
    const processedFiles: any[] = [];
    Array.from(fileList)
      .filter((file) => file.type === 'application/vnd.ms-excel')
      .forEach(async (file) => {
        const text = await (file as File).text();
        const lista = dsvFormat(';').parseRows(text);
        processedFiles.push(processIggFile(lista));
      });
    return processedFiles;
  } else {
    const blob = file as Blob;
    const promise = new Promise<unknown>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(blob);

      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        const bufferArray = e.target!.result as ArrayBuffer;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    return promise.then((d) => {
      return processIggFile(d);
    });
  }
};

const processIggFile = (file: any) => {
  const processedFile = [];
  const header = [
    'km',
    'secao',
    'fi',
    'ttc',
    'ttl',
    'tlc',
    'tll',
    'trr',
    'j',
    'tb',
    'je',
    'tbe',
    'alp',
    'atp',
    'alc',
    'atc',
    'o',
    'p',
    'e',
    'ex',
    'd',
    'r',
    'tri',
    'ter',
  ];
  processedFile.push(header);

  const fileWithoutUselessRows = file.slice(4, file.length);

  fileWithoutUselessRows.forEach((item) => {
    const arr = new Array(24).fill(null);
    arr[0] = item['INVENTÁRIO DO ESTADO DA SUPERFÍCIE DO PAVIMENTO'];
    arr[1] = item['__EMPTY'];

    let keys = Object.keys(item);
    keys = keys.slice(2, keys.length);
    keys.forEach((key) => {
      const column = parseInt(key.substring('__EMPTY_'.length));
      if (column < 21) {
        arr[column + 1] = true;
      } else {
        arr[column + 1] = item[key];
      }
    });

    processedFile.push(arr);
  });

  return processedFile;
};
