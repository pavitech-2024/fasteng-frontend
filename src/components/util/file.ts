import * as XLSX from 'xlsx';
import { dsvFormat } from 'd3-dsv';

export const processFile = async (file: FileList | Blob, processEssayMethod) => {
  if ((file as FileList)[0]?.type === 'application/vnd.ms-excel') {
    const fileList = file as FileList;
    const processedFiles: any[] = [];
    Array.from(fileList)
      .filter((file) => file.type === 'application/vnd.ms-excel')
      .forEach(async (file) => {
        const text = await (file as File).text();
        const lista = dsvFormat(';').parseRows(text);
        processedFiles.push(lista);
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
      return processEssayMethod(d);
    });
  }
};
