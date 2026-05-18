const date = new Date();
date.setDate(date.getDate() - 1);

export const yesterdayDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
