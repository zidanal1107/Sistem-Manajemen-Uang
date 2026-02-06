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

    if (tabungan === "" || isNaN(tabungan) ) {
        showToast("Nominal tidak valid!", "error");
        return;
    }
    if (parseInt(tabungan) <= 0) {
        showToast("Nominal tabungan harus lebih dari 0!", "error");
        return;
    }
    jumlahTabungan += parseInt(tabungan);

    localStorage.setItem('tabungan', JSON.stringify(jumlahTabungan));
    renderTabungan();
    renderTotalan();
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

    const nominal = parseInt(pengeluaran);

    if (nominal > jumlahTabungan - jumlahPengeluaran) {
        showToast("Tabungan tidak cukup!", "error");
        return;
    }
    if (nominal <= 0 || isNaN(nominal)) {
        showToast("Nominal pengeluaran tidak valid!", "error");
        return;
    }
    if (namaBarang === "" || jumlahBarang === "" || nominal === "") {
        showToast("Masih ada yang kosong!", "error");
        return;
    }
    const qty = parseInt(jumlahBarang);
    if (isNaN(qty) || qty <= 0) {
        showToast("Jumlah barang tidak valid!", "error");
        return;
    }

    pengeLuaran.push({
        id: Date.now(),
        namaBarang, jumlahBarang, pengeluaran: nominal,
        waktu: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        row.classList.add('table-row');
        row.innerHTML = `
            <td>${d.namaBarang}</td>
            <td>${d.jumlahBarang}</td>
            <td class="money">Rp. ${d.pengeluaran}</td>
            <td>${d.waktu}</td> 
            <td>${d.tanggal}</td>
            <td><button onclick="deletePengeluaran(${d.id})" class="bg-red-500 text-white px-2 py-1 rounded-md">Hapus</button></td>
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

    let sisa = jumlahTabungan - jumlahPengeluaran;
    const totalTabungan = document.getElementById("total-tabungan");
    const row = document.createElement('p');
    row.textContent = `Total Tabungan: Rp. ${sisa}`;
    totalTabungan.innerHTML = '';
    totalTabungan.appendChild(row);
};

renderTotalan();

/**************
 * DELETE PENGELUARAN
 * ************/

const deletePengeluaran = (id) => {
    let pengeLuaran = JSON.parse(localStorage.getItem('dataPengeluaran')) || [];
    let jumlahPengeluaran = parseInt(localStorage.getItem('pengeluaran')) || 0;

    const itemToDelete = pengeLuaran.find(item => item.id === id);
    if (itemToDelete) {
        jumlahPengeluaran -= parseInt(itemToDelete.pengeluaran);
        pengeLuaran = pengeLuaran.filter(item => item.id !== id);
        localStorage.setItem('pengeluaran', JSON.stringify(jumlahPengeluaran));
        localStorage.setItem('dataPengeluaran', JSON.stringify(pengeLuaran));
        renderPengeluaran();
        renderTotalan();
        showToast("Pengeluaran berhasil dihapus!", "success");
    }
};

/**************
 * EDIT TABUNGAN
 * ************/

const popup = document.getElementById("popup");
const popupInput = document.getElementById("popup-input");
const popupOk = document.getElementById("popup-ok");
const popupCancel = document.getElementById("popup-cancel");
const errorDiv = document.getElementById("error");

const editTabungan = (title = "Masukkan nominal") => {
    document.getElementById("popup-title").innerText = title;
    document.getElementById("popup-keterangan").innerText = "Nominal akan dikurangi dengan total pengeluaran saat ini: Rp. " + (parseInt(localStorage.getItem('pengeluaran')) || 0);
    popup.classList.remove("hidden");
    popup.classList.add("flex");
    popupInput.classList.remove("border", "border-red-500", "bg-red-100");
    errorDiv.classList.add("hidden");
}

popupOk.onclick = () => {
    popup.classList.add("hidden");

    if (popupInput.value === "" || isNaN(popupInput.value) || parseInt(popupInput.value) < 0) {
        errorDiv.classList.remove("hidden");
        popup.classList.remove("hidden");
        popupInput.classList.add("border", "border-red-500", "bg-red-100");
        return;
    }
    let jumlahPengeluaran = parseInt(localStorage.getItem('pengeluaran')) || 0;
    let tabungan = parseInt(localStorage.getItem('tabungan')) || 0;

    tabungan = parseInt(popupInput.value);

    localStorage.setItem('tabungan', JSON.stringify(tabungan));
    renderTabungan();
    renderTotalan();
    showToast("Tabungan berhasil diupdate!", "success");
    popupInput.value = "";
};

popupCancel.onclick = () => {
    popup.classList.add("hidden");
    popupInput.value = "";
};
