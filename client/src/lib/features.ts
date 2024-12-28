import moment from "moment";

const transformImage: any = (url = "", width = 100) => url;

const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    last7Days.unshift(dayName);
  }
  return last7Days;
};

const getNext7Days = () => {
  const next7Days = [];
  const currentDate = new Date();
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(currentDate);
    dayDate.setDate(currentDate.getDate() + i);
    const dayName = dayDate.toLocaleDateString("en-US", { weekday: "long" });
    next7Days.push(dayName);
  }

  return next7Days;
};

export { transformImage, getLast7Days, getNext7Days };
