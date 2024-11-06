function formatDate(date) {
  date = new Date(date);
  const namaHari = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const namaHariInggris = namaHari[date.getDay()];
  const tanggalBulan = date.getDate();
  const namaBulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const namaBulanInggris = namaBulan[date.getMonth()];
  const tahun = date.getFullYear();
  const formatTanggal = `${namaHariInggris}, ${tanggalBulan} ${namaBulanInggris} ${tahun}`;
  return formatTanggal;
}

function formatDateSimple(date) {
  date = new Date(date);
  const tanggalBulan = date.getDate();
  const namaBulanInggris = date.getMonth();
  const tahun = date.getFullYear();
  const formatTanggal = `${tahun}-${
    tanggalBulan < 10 ? "0" + tanggalBulan : tanggalBulan
  }-${namaBulanInggris < 10 ? "0" + namaBulanInggris : namaBulanInggris}`;
  return formatTanggal;
}

const formateDateKhusus = (angka) => {
  var excelDate = new Date(1900, 0, angka); // 1 Januari 1900 adalah tanggal serial 1
  return excelDate.toISOString().substr(0, 10);

  return tanggalFormat; // Hasil: "2023-10-03"
};

function formatDateNew(inputTanggal, formatKeluaran) {
  console.log(inputTanggal);
  const tanggal = new Date(inputTanggal);
  if (isNaN(tanggal.getTime())) {
    return "Tanggal tidak valid";
  }

  const yearNumeric = tanggal.getFullYear();
  const monthNumeric = (tanggal.getMonth() + 1).toString().padStart(2, '0');
  const dayNumeric = tanggal.getDate().toString().padStart(2, '0'); 
  const tahun = tanggal.getFullYear();
  const bulanLong = tanggal.toLocaleString("id-ID", { month: "long" });
  const tanggalTampil = tanggal.getDate();
  const hariLong = tanggal.toLocaleString("id-ID", { weekday: "long" });
  const bulan = tanggal.toLocaleString("id-ID", { month: "short" });
  const bulanNumeric = tanggal.toLocaleString("id-ID", { month: "numeric" });
  const hari = tanggal.toLocaleString("id-ID", { weekday: "short" });
  const jam = String(tanggal.getHours()).padStart(2, "0");
  const menit = String(tanggal.getMinutes()).padStart(2, "0");
  const detik = String(tanggal.getSeconds()).padStart(2, "0");

  switch (formatKeluaran) {
    case "HH:mm":
      return `${jam}:${menit}`;
    case "MM-YYYY":
      return `${bulan}-${tahun}`;
    case "YYYY-MM-DD":
      return `${tahun}-${bulan}-${tanggalTampil}`;
    case "YYYY-MM-DD/numeric":
      return `${yearNumeric}-${monthNumeric}-${dayNumeric}`;
    case "DD-MM-YYYY":
      return `${tanggalTampil}-${bulan}-${tahun}`;
    case "DD/MM/YYYY":
      return `${tanggalTampil}/${bulan}/${tahun}`;
    case "DD MM YYYY":
      return `${tanggalTampil} ${bulanLong} ${tahun}`;
    case "MM/DD/YYYY":
      return `${bulan}/${tanggalTampil}/${tahun}`;
    case "YYYY/MM/DD":
      return `${tahun}/${bulan}/${tanggalTampil}`;
    case "YYYY-MM-DD HH:mm:ss":
      return `${tahun}-${bulan}-${tanggalTampil} ${jam}:${menit}:${detik}`;
    case "Hari, DD Bulan YYYY":
      return `${hari}, ${tanggalTampil} ${bulan} ${tahun}`;
    // Tambahkan format lain sesuai kebutuhan Anda
    default:
      return "Format tidak valid";
  }
}

export { formatDate, formateDateKhusus, formatDateSimple, formatDateNew };
