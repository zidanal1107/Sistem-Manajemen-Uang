// Popup Toast Function
const showToast = (message, type = "success") => {
    const toast = document.getElementById("toast");
    const msg = document.getElementById("toast-message");

    msg.textContent = message;

    // reset warna
    toast.classList.remove("bg-green-500", "bg-red-500");

    if (type === "success") {
        toast.classList.add("bg-green-500");
    } else if (type === "error") {
        toast.classList.add("bg-red-500");
    }

    // tampilkan
    toast.classList.remove("translate-x-full", "opacity-0");
    toast.classList.add("translate-x-0", "opacity-100");

    // sembunyikan otomatis
    setTimeout(() => {
        toast.classList.add("translate-x-full", "opacity-0");
        toast.classList.remove("translate-x-0", "opacity-100");
    }, 3000);
};

/**************
 * TABUNGAN
 * ************/
const tambahTabungan = document.getElementById('tambah-tabungan-form');

tambahTabungan.addEventListener("submit", (e) => {
    e.preventDefault();

    const tabungan = document.getElementById('tabungan').value;
    let jumlahTabungan = parseInt(localStorage.getItem('tabungan')) || 0;

    jumlahTabungan += parseInt(tabungan);

    localStorage.setItem('tabungan', JSON.stringify(jumlahTabungan));
    renderTabungan();
    showToast("Tabungan berhasil ditambahkan!", "success");
    tambahTabungan.reset();
});

const renderTabungan = () => {
    let jumlahTabungan = parseInt(localStorage.getItem('tabungan')) || 0;
    const totalTabungan = document.getElementById("total-tabungan");

    const row = document.createElement('p');
    row.textContent = `Total Tabungan: Rp. ${jumlahTabungan}`;
    totalTabungan.innerHTML = '';
    totalTabungan.appendChild(row);
};

renderTabungan();

/**************
 * PENGELUARAN
 * ************/

const tambahPengeluaran = document.getElementById('tambah-pengeluaran-form');

tambahPengeluaran.addEventListener("submit", (e) => {
    e.preventDefault();

    let jumlahPengeluaran = parseInt(localStorage.getItem('pengeluaran')) || 0;
    let jumlahTabungan = parseInt(localStorage.getItem('tabungan')) || 0;
    const pengeLuaran = JSON.parse(localStorage.getItem('dataPengeluaran')) || [];
    
    const namaBarang = document.getElementById('namaBarang').value;
    const jumlahBarang = document.getElementById('jumlahBarang').value;
    const pengeluaran = document.getElementById('pengeluaran').value;
    
    if (pengeluaran > jumlahTabungan) {
        showToast("Saldo tidak cukup! (MISKIN)", "error");
        tambahPengeluaran.reset();
        return;
    }
    
    pengeLuaran.push({ 
        id: pengeLuaran.length+1,
        namaBarang, jumlahBarang, pengeluaran, 
        waktu: new Date().getHours() + ":" + new Date().getMinutes(), 
        tanggal: new Date().toLocaleDateString() 
    });
    jumlahPengeluaran += parseInt(pengeluaran);
    localStorage.setItem('pengeluaran', JSON.stringify(jumlahPengeluaran));
    localStorage.setItem('dataPengeluaran', JSON.stringify(pengeLuaran));
    renderPengeluaran();
    renderTotalan();
    showToast("Pengeluaran berhasil ditambahkan!", "success");
    tambahPengeluaran.reset();
});

const renderPengeluaran = () => {
    let jumlahPengeluaran = parseInt(localStorage.getItem('pengeluaran')) || 0;
    const pengeLuaran = JSON.parse(localStorage.getItem('dataPengeluaran')) || [];

    const totalPengeluaran = document.getElementById("total-pengeluaran");
    const totalTransaksi = document.getElementById("total-transaksi");

    const row = document.createElement('p');
    row.textContent = `Total Pengeluaran: Rp. ${jumlahPengeluaran}`;
    totalPengeluaran.innerHTML = '';
    totalPengeluaran.appendChild(row);

    const row2 = document.createElement('p');
    row2.textContent = `Total Transaksi: ${pengeLuaran.length} kali`;
    totalTransaksi.innerHTML = '';
    totalTransaksi.appendChild(row2);

    const tablePengeluaran = document.getElementById('daftar-pengeluaran');
    tablePengeluaran.innerHTML = '';

    pengeLuaran.forEach(d => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${d.namaBarang}</td>
            <td>${d.jumlahBarang}</td>
            <td>Rp. ${d.pengeluaran}</td>
            <td>${d.waktu}</td> 
            <td>${d.tanggal}</td>
        `;
        tablePengeluaran.appendChild(row);
    });
};

renderPengeluaran();

/**************
 * TOTALAN
 * ************/

const renderTotalan = () => {
    let jumlahTabungan = parseInt(localStorage.getItem('tabungan')) || 0;
    let jumlahPengeluaran = parseInt(localStorage.getItem('pengeluaran')) || 0;

    jumlahTabungan -= jumlahPengeluaran;
    const totalTabungan = document.getElementById("total-tabungan");
    const row = document.createElement('p');
    row.textContent = `Total Tabungan: Rp. ${jumlahTabungan}`;
    totalTabungan.innerHTML = '';
    totalTabungan.appendChild(row);
};

renderTotalan();