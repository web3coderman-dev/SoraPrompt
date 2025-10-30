#!/usr/bin/env node

/**
 * Google 域名验证 - DNS 记录检查工具
 * 用于验证 soraprompt.studio 的 Google 验证 TXT 记录是否已生效
 */

const dns = require('dns').promises;

const DOMAIN = 'soraprompt.studio';
const EXPECTED_VERIFICATION = 'google-site-verification=j2nrnLhJJ0F7ft7OJ8aFgKkZ7kNOs-pzg6zZiOuZRy0';

async function checkDNSVerification() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Google 域名验证检查工具                                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`🔍 正在检查域名: ${DOMAIN}\n`);

  try {
    // 检查 TXT 记录
    console.log('📝 查询 TXT 记录...\n');
    const txtRecords = await dns.resolveTxt(DOMAIN);

    if (txtRecords.length === 0) {
      console.log('❌ 未找到任何 TXT 记录');
      console.log('\n⚠️  请先在 DNS 管理平台添加 Google 验证记录');
      showNextSteps();
      return false;
    }

    console.log(`✅ 找到 ${txtRecords.length} 条 TXT 记录:\n`);

    let foundVerification = false;
    txtRecords.forEach((record, index) => {
      const recordString = record.join('');
      console.log(`   ${index + 1}. ${recordString}`);

      if (recordString === EXPECTED_VERIFICATION) {
        foundVerification = true;
        console.log('      ✅ 这是正确的 Google 验证记录！');
      } else if (recordString.includes('google-site-verification')) {
        console.log('      ⚠️  这是一个 Google 验证记录，但值不匹配');
      }
    });

    console.log('\n' + '─'.repeat(60) + '\n');

    if (foundVerification) {
      console.log('🎉 验证成功！\n');
      console.log('✅ DNS 记录已正确配置');
      console.log('✅ Google 验证记录已生效\n');
      console.log('📌 下一步操作:');
      console.log('   1. 访问 Google Cloud 验证中心');
      console.log('   2. 点击"验证"按钮');
      console.log('   3. 等待验证完成（可能需要几分钟）');
      console.log('   4. 确认"首页要求"状态变为 ✅\n');
      console.log('🔗 验证中心链接:');
      console.log('   https://console.cloud.google.com/apis/credentials/consent\n');
      return true;
    } else {
      console.log('❌ 验证失败\n');
      console.log('⚠️  未找到正确的 Google 验证记录\n');
      console.log('📋 期望的记录值:');
      console.log(`   ${EXPECTED_VERIFICATION}\n`);
      showNextSteps();
      return false;
    }

  } catch (error) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      console.log('❌ 域名解析失败或未找到 TXT 记录\n');
      console.log('可能原因:');
      console.log('   1. DNS 记录尚未添加');
      console.log('   2. DNS 传播尚未完成（请等待 10-30 分钟）');
      console.log('   3. 域名配置有误\n');
      showNextSteps();
    } else {
      console.log('❌ 查询失败:', error.message);
    }
    return false;
  }
}

function showNextSteps() {
  console.log('📝 如何添加 DNS TXT 记录:\n');
  console.log('1️⃣  登录 Vercel Dashboard (https://vercel.com/dashboard)');
  console.log('2️⃣  找到 soraprompt.studio 项目');
  console.log('3️⃣  进入 Settings → Domains');
  console.log('4️⃣  找到 DNS Records 部分');
  console.log('5️⃣  添加以下记录:\n');
  console.log('    ┌─────────────────────────────────────────────────┐');
  console.log('    │ Type:  TXT                                      │');
  console.log('    │ Name:  @                                        │');
  console.log('    │ Value: ' + EXPECTED_VERIFICATION.substring(0, 30) + '... │');
  console.log('    │ TTL:   3600 (或默认)                            │');
  console.log('    └─────────────────────────────────────────────────┘\n');
  console.log('6️⃣  保存后等待 10-15 分钟');
  console.log('7️⃣  重新运行此脚本检查: node docs/deployment/verify-dns.js\n');
  console.log('📚 详细文档: docs/deployment/google-verification-guide.md\n');
}

// 主函数
(async () => {
  const result = await checkDNSVerification();
  process.exit(result ? 0 : 1);
})();
