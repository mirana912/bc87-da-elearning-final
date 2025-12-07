// test/create-user-and-update-to-gv-auto.ts
// Script tự động: Tạo người dùng mới, sau đó tự động update lên role GV
import axios from 'axios';

const BASE_URL = 'https://elearningnew.cybersoft.edu.vn';
const CYBERSOFT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NyIsIkhldEhhblN0cmluZyI6IjIzLzAzLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3NDIyNDAwMDAwMCIsIm5iZiI6MTc0NzI0MjAwMCwiZXhwIjoxNzc0MzcxNjAwfQ.-W4bvmZuRBJxryMtPHaMnmm11rdGxNTYol7fLRQid1g';

interface RegisterUser {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
}

interface UpdateUser {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDT: string;
  maLoaiNguoiDung: 'GV' | 'ADMIN' | 'HV';
  maNhom: string;
}

const registerUser = async (userData: RegisterUser) => {
  try {
    console.log('\n🔄 Bước 1: Đang đăng ký tài khoản mới...');
    console.log(`   Tài khoản: ${userData.taiKhoan}`);
    console.log(`   Họ tên: ${userData.hoTen}`);
    console.log(`   Email: ${userData.email}`);

    const response = await axios.post(
      `${BASE_URL}/api/QuanLyNguoiDung/DangKy`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          'TokenCybersoft': CYBERSOFT_TOKEN,
        },
      }
    );

    console.log('✅ Đăng ký tài khoản thành công!');
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response) {
      console.error('\n❌ Lỗi khi đăng ký:');
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || JSON.stringify(error.response.data)}`);
      
      if (error.response.status === 400) {
        console.error('   Có thể tài khoản đã tồn tại hoặc dữ liệu không hợp lệ.');
      }
      
      return { success: false, error: error.response.data };
    }
    console.error('\n❌ Lỗi:', error.message);
    return { success: false, error: error.message };
  }
};

const login = async (taiKhoan: string, matKhau: string) => {
  try {
    console.log('\n🔄 Bước 2: Đang đăng nhập với tài khoản vừa tạo...');
    const response = await axios.post(
      `${BASE_URL}/api/QuanLyNguoiDung/DangNhap`,
      { taiKhoan, matKhau },
      {
        headers: {
          'Content-Type': 'application/json',
          'TokenCybersoft': CYBERSOFT_TOKEN,
        },
      }
    );

    const accessToken = response.data?.accessToken;
    if (accessToken) {
      console.log('✅ Đăng nhập thành công!');
      return accessToken;
    }
    throw new Error('Không nhận được access token');
  } catch (error: any) {
    console.error('\n❌ Lỗi đăng nhập:', error.response?.data?.message || error.message);
    return null;
  }
};

const updateUserToGV = async (userData: UpdateUser, accessToken: string) => {
  try {
    console.log('\n🔄 Bước 3: Đang cập nhật quyền lên GV...');
    console.log(`   Tài khoản: ${userData.taiKhoan}`);
    console.log(`   Loại người dùng mới: ${userData.maLoaiNguoiDung}`);

    const response = await axios.put(
      `${BASE_URL}/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'TokenCybersoft': CYBERSOFT_TOKEN,
        },
      }
    );

    console.log('✅ Cập nhật quyền GV thành công!');
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response) {
      console.error('\n❌ Lỗi khi cập nhật:');
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || JSON.stringify(error.response.data)}`);
      
      if (error.response.status === 403) {
        console.error('   Lỗi 403: Token không có quyền cập nhật role.');
      }
      
      return { success: false, error: error.response.data };
    }
    console.error('\n❌ Lỗi:', error.message);
    return { success: false, error: error.message };
  }
};

const updateUserToGVWithAdmin = async (userData: UpdateUser, adminToken: string) => {
  try {
    console.log('\n🔄 Bước 3: Đang cập nhật quyền lên GV (sử dụng admin token)...');
    console.log(`   Tài khoản: ${userData.taiKhoan}`);
    console.log(`   Loại người dùng mới: ${userData.maLoaiNguoiDung}`);

    const response = await axios.put(
      `${BASE_URL}/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'TokenCybersoft': CYBERSOFT_TOKEN,
        },
      }
    );

    console.log('✅ Cập nhật quyền GV thành công!');
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response) {
      console.error('\n❌ Lỗi khi cập nhật:');
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || JSON.stringify(error.response.data)}`);
      
      return { success: false, error: error.response.data };
    }
    console.error('\n❌ Lỗi:', error.message);
    return { success: false, error: error.message };
  }
};

const main = async () => {
  console.log('='.repeat(60));
  console.log('🔧 Script Tự Động: Tạo User Và Tự Update Lên GV');
  console.log('='.repeat(60));
  console.log('\n📝 Quy trình:');
  console.log('   1. Đăng ký tài khoản mới (không cần auth)');
  console.log('   2. Đăng nhập với tài khoản vừa tạo');
  console.log('   3. Cập nhật quyền lên GV\n');

  // Parse arguments
  const args = process.argv.slice(2);
  
  let adminToken: string | undefined;
  
  args.forEach((arg) => {
    if (arg.startsWith('--admin-token=')) {
      adminToken = arg.replace('--admin-token=', '');
    }
  });

  // Tạo tài khoản mới với thông tin mặc định
  const timestamp = Date.now();
  const registerData: RegisterUser = {
    taiKhoan: `gv_${timestamp}`,
    matKhau: 'GV@123',
    hoTen: `Giảng viên ${timestamp}`,
    email: `gv_${timestamp}@example.com`,
    soDT: '0123456789',
    maNhom: 'GP01',
  };

  // Hoặc lấy từ command line
  args.forEach((arg) => {
    if (arg.startsWith('--user=')) {
      registerData.taiKhoan = arg.replace('--user=', '');
    } else if (arg.startsWith('--pass=')) {
      registerData.matKhau = arg.replace('--pass=', '');
    } else if (arg.startsWith('--name=')) {
      registerData.hoTen = arg.replace('--name=', '');
    } else if (arg.startsWith('--email=')) {
      registerData.email = arg.replace('--email=', '');
    } else if (arg.startsWith('--phone=')) {
      registerData.soDT = arg.replace('--phone=', '');
    }
  });

  // Bước 1: Đăng ký tài khoản
  const registerResult = await registerUser(registerData);

  if (!registerResult.success) {
    console.error('\n❌ Không thể đăng ký tài khoản. Dừng quy trình.');
    process.exit(1);
  }

  // Bước 2: Đăng nhập
  const userToken = await login(registerData.taiKhoan, registerData.matKhau);

  if (!userToken) {
    console.error('\n❌ Không thể đăng nhập. Dừng quy trình.');
    process.exit(1);
  }

  // Bước 3: Cập nhật quyền GV
  const updateData: UpdateUser = {
    taiKhoan: registerData.taiKhoan,
    matKhau: registerData.matKhau,
    hoTen: registerData.hoTen,
    email: registerData.email,
    soDT: registerData.soDT,
    maLoaiNguoiDung: 'GV',
    maNhom: registerData.maNhom,
  };

  // Thử với token của user trước, nếu không được thì dùng admin token
  let updateResult = await updateUserToGV(updateData, userToken);

  if (!updateResult.success && adminToken) {
    console.log('\n⚠️  Không thể update với user token, thử với admin token...');
    updateResult = await updateUserToGVWithAdmin(updateData, adminToken);
  }

  if (!updateResult.success) {
    console.error('\n❌ Không thể cập nhật quyền GV.');
    console.error('   Tài khoản đã được tạo nhưng vẫn là tài khoản thường.');
    console.error('   Có thể cần quyền admin để update maLoaiNguoiDung.');
    console.error('   Thử chạy lại với --admin-token=YOUR_ADMIN_TOKEN');
    process.exit(1);
  }

  // Thành công
  console.log('\n' + '='.repeat(60));
  console.log('✅ HOÀN TẤT! Tài khoản GV đã được tạo thành công!');
  console.log('='.repeat(60));
  console.log('\n📋 Thông tin tài khoản:');
  console.log(`   Tài khoản: ${registerData.taiKhoan}`);
  console.log(`   Mật khẩu: ${registerData.matKhau}`);
  console.log(`   Họ tên: ${registerData.hoTen}`);
  console.log(`   Email: ${registerData.email}`);
  console.log(`   Loại người dùng: GV (Giảng viên)`);
  console.log('='.repeat(60));
  console.log('\n💡 Bạn có thể đăng nhập với tài khoản này ngay bây giờ!');
};

main().catch((error) => {
  console.error('\n❌ Lỗi không mong đợi:', error);
  process.exit(1);
});

