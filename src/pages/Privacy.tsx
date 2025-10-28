import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sceneBackground text-text-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Logo size={48} />
            <h1 className="text-4xl font-bold font-display">隐私政策</h1>
          </div>
          <p className="text-text-secondary">最后更新：2025年1月</p>
        </div>

        <div className="space-y-8 bg-sceneFill rounded-2xl p-8 border border-borderSubtle">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. 信息收集</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                当您使用 SoraPrompt Studio 时，我们可能会收集以下信息：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>账户信息：通过 Google OAuth 提供的基本资料（邮箱、姓名、头像）</li>
                <li>使用数据：您创建的提示词、生成历史、使用偏好设置</li>
                <li>技术信息：设备类型、浏览器类型、IP 地址、访问时间</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. 信息使用</h2>
            <div className="text-text-secondary space-y-3">
              <p>我们使用收集的信息用于：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>提供和改进我们的服务</li>
                <li>个性化您的使用体验</li>
                <li>跨设备同步您的数据</li>
                <li>分析使用模式以优化产品功能</li>
                <li>发送重要的服务通知</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. 数据存储</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                您的数据安全存储在 Supabase 云平台上，采用行业标准的加密措施。
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>所有数据传输均通过 HTTPS 加密</li>
                <li>访客模式数据仅存储在本地浏览器中</li>
                <li>已登录用户的数据自动备份到云端</li>
                <li>我们不会出售或出租您的个人信息</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. 第三方服务</h2>
            <div className="text-text-secondary space-y-3">
              <p>我们使用以下第三方服务：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Google OAuth：</strong>用于身份验证，遵循 Google 的隐私政策
                </li>
                <li>
                  <strong>OpenAI API：</strong>用于 AI 提示词生成，您的输入会被发送到 OpenAI 进行处理
                </li>
                <li>
                  <strong>Supabase：</strong>用于数据存储和用户管理
                </li>
                <li>
                  <strong>Stripe：</strong>用于支付处理（如适用）
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Cookie 和追踪技术</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                我们使用 Cookie 和类似技术来：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>保持您的登录状态</li>
                <li>记住您的语言和主题偏好</li>
                <li>分析网站使用情况</li>
                <li>提供个性化体验</li>
              </ul>
              <p className="mt-3">
                您可以通过浏览器设置管理 Cookie 偏好，但这可能影响部分功能的使用。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. 您的权利</h2>
            <div className="text-text-secondary space-y-3">
              <p>您对自己的数据拥有以下权利：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>访问：查看我们存储的关于您的信息</li>
                <li>更正：要求修正不准确的信息</li>
                <li>删除：要求删除您的账户和相关数据</li>
                <li>导出：获取您的数据副本</li>
                <li>撤回同意：随时停止使用我们的服务</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. 儿童隐私</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                我们的服务不面向 13 岁以下的儿童。如果我们发现无意中收集了儿童的个人信息，
                我们会立即删除这些信息。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. 政策更新</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                我们可能会不时更新本隐私政策。重大变更将通过邮件或网站通知您。
                继续使用我们的服务即表示您接受更新后的政策。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. 联系我们</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li>邮箱：privacy@soraprompt.studio</li>
                <li>网站：https://soraprompt.studio</li>
              </ul>
            </div>
          </section>

          <section className="pt-4 border-t border-borderSubtle">
            <p className="text-sm text-text-tertiary">
              本隐私政策适用于 SoraPrompt Studio 的所有用户，无论您身在何处。
              我们致力于保护您的隐私并确保数据安全。
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Button variant="director" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
