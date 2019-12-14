> [uTools](https://u.tools/) 是一个极简、插件化、跨平台的现代桌面软件。通过自由选配丰富的插件，打造你得心应手的工具集合。

> 当你熟悉它后，能够为你节约大量时间，让你可以更加专注地改变世界。

# 本项目是 uTools 的 Laravel 中文文档速查插件

使用快捷键呼出 [uTools](https://u.tools/) 后，输入任何你想查询的关键字（如： Scope），得到相关结果项的下拉菜单，上下移动选择回车或点击相应的条目即可前往 [Laravel China](http://laravel-china.org) 网站查看具体内容详情。

### 目前版本：6.x

# 发行说明

- [语义化版本](#versioning-scheme)
- [支持策略](#support-policy)
- [Laravel 6.0](#laravel-6.0)

<a name="versioning-scheme"></a>
## 语义化版本

Laravel 和官方扩展包将正式遵循 [语义化版本](https://semver.org/lang/zh-CN/)。每六个月会发布一个大版本（如：6.0、7.0），每周可能会有小版本和补丁版本发布。小版本和补丁 **绝不** 包含破坏性变更。

当你在项目或者扩展包依赖于 Laravel 框架时，因大版本会包含破坏性变更，故必须使用大版本限制，如：`^6.0`。即便如此，我们仍然会努力减低你升级时的耗时，使其控制在一天或者更少。
<a name="support-policy"></a>
## 支持策略

对于 `LTS` 版本，例如 ` Laravel 6.0`，将会提供为期两年的错误修复和三年的安全修复。这些版本提供了最长时间的支持和维护。对于一般版本，只会提供六个月的错误修复和一年的安全修复。对于所有其他库，包括  `Lumen` ，只有最新版本会得到错误修复。

|  版本 |  发布时间 |  Bug 修复截止时间 |  安全修复截止时间 |
| :--- | :---- | :---- | :---- |
|  5.5 (LTS) | 2017 年 8 月 30 日 | 2019 年 8 月 30 日 |2020 年 8 月 30 日 |
|  5.6 | 2018 年 2 月 7 日 | 2018 年 8 月 7 日 | 2019 年 2 月 7 日 |
|  5.7 | 2018 年 9 月 4 日 | 2019 年 3 月 4 日 | 2019 年 9 月 4 日 |
|  5.8 | 2019 年 2 月 26 日| 2019 年 8 月 26 日 | 2020 年 2 月 26 日 |
|  6.0 (LTS) | 2019 年 9 月 3 日 |2021 年 9 月 3 日 | 2022 年 9 月 3 日 |






<a name="laravel-6.0"></a>
## Laravel 6.0

Laravel 6.0（LTS）通过引入[语义化版本](https://semver.org/lang/zh-CN/)、与[Laravel Vapor](https://vapor.laravel.com)的兼容性、优化了授权响应、任务中间件、懒集合、子查询优化、并将前端脚手架单独分离到`laravel/ui` Composer 软件包，以及其他各种错误修复和可用性改进。

### 语义版本控制

laravel 框架扩展包现在开始使用[语义化版本](https://semver.org/lang/zh-CN/)。这使得框架与已经遵循此版本控制标准的其他第一方Laravel包保持一致。Laravel发布周期将保持不变。

### Laravel Vapor 兼容性

*Laravel Vapor由[Taylor Otwell](https://github.com/taylorotwell)开发。*

Laravel 6.0提供了与[Laravel Vapor](https://vapor.laravel.com)的兼容性，这是一个用于Laravel的自动伸缩无服务器部署平台。vapor抽象了管理aws lambda上的laravel应用程序的复杂性，以及将这些应用程序与sqs队列、数据库、redis集群、网络、 CloudFront CDN等接口的复杂性。


### 改进的异常：Ignition

Laravel 自带了 [Ignition](https://github.com/facade/ignition)，这是一个由 Freek Van der Herten 与 Marcel Pociot 创建的关于异常详情页面的新的开源项目。相较之前的版本，Ignition 具有许多优势，比如改进的错误页面 Blade 文件与行号处理、对常见问题的运行时解决、代码编辑、异常共享以及改进的用户体验。

### 改进的授权响应

_改进的授权响应由 [Gary Green](https://github.com/garygreen) 实现。_

在之前的 Laravel 版本中，很难提取并向最终的用户展示自定义的授权消息，这就导致了很难跟最终用户解释某个特定请求为什么会被拒绝。在 Laravel 6.0 中，使用授权响应消息和新方法 `Gate::inspect` 将会让事情变得更加容易。比如，给定以下授权策略（Policy）方法：

```php

/**
* 判断用户能否查看指定的航班
*
* @param \App\User $user
* @param \App\Flight $flight
* @return  mixed
*/
public function view(User  $user, Flight  $flight)
{
    return $this->deny('Explanation of denial.');
}
```

使用 `Gate::inspect` 方法可以很容易地提取出授权策略的响应和消息：

```php
$response = Gate::inspect('view', $flight);

if ($response->allowed()) {
	// 用户被允许查看该航班……
}

if ($response->denied()) {
	echo  $response->message();
}
```

除此之外，当你在路由或者控制器中使用了诸如 `$this->authorize` 或 `Gate::authorize` 的辅助方法后，这些自定义信息将能够自动地返回给你的前端。


### 任务中间件

_任务中间件是由  [Taylor Otwell](https://github.com/taylorotwell)  实现的_。

任务中间件允许你围绕任务队列的执行封装自定义逻辑，从而减少任务本身的引用。例如：在 Laravel 的上一个发行版本里，你可能封装了一个有关速率限制的回调逻辑在任务的 `handle` 方法中：

    /**
     * 执行任务
     *
     * @return void
     */
    public function handle()
    {
        Redis::throttle('key')->block(0)->allow(1)->every(5)->then(function () {
            info('获取锁...');

            // 处理任务...
        }, function () {
            // 无法获取锁...

            return $this->release(5);
        });
    }

在 Laravel 6.0 里，这个逻辑可以被提取到一个任务中间件中，从而让你任务的 `handle` 方法不用承担任何速率限制的职责：

    <?php

    namespace App\Jobs\Middleware;

    use Illuminate\Support\Facades\Redis;

    class RateLimited
    {
        /**
         * 处理任务队列
         *
         * @param  mixed  $job
         * @param  callable  $next
         * @return mixed
         */
        public function handle($job, $next)
        {
            Redis::throttle('key')
                    ->block(0)->allow(1)->every(5)
                    ->then(function () use ($job, $next) {
                        // 获取锁...

                        $next($job);
                    }, function () use ($job) {
                        // 无法获取锁...

                        $job->release(5);
                    });
        }
    }

创建中间件之后，它们可以通过返回任务的 `middleware` 方法连接到任务：

    use App\Jobs\Middleware\RateLimited;

    /**
     * 获得任务的中间件
     *
     * @return array
     */
    public function middleware()
    {
        return [new RateLimited];
    }


### 懒集合

懒集合 由 [Joseph Silber](https://github.com/JosephSilber)开发 。

许多开发者已经感受到了 `Laravel `[集合](https://learnku.com/docs/{{version}}/collections) 的强大。为了补充已经很强大的  `集合` 类， `Laravel 6.0` 引入了 一个，利用  `PHP` 的 [生成器](https://www.php.net/manual/zh/language.generators.overview.php) 来实现的 `懒集合`，允许你使用非常大的数据集合的同时保持较低的内存使用率。

例如，想像你的应用程序需要处理 1 个多 GB 大小的日志文件，同时利用 `Laravel` 的集合来解析日志。通过懒集合可以在给定时间内仅将文件的一部分保留在内存中，而不是一次将整个文件都读入内存：

    use App\LogEntry;
    use Illuminate\Support\LazyCollection;

    LazyCollection::make(function () {
        $handle = fopen('log.txt', 'r');

        while (($line = fgets($handle)) !== false) {
            yield $line;
        }
    })
    ->chunk(4)
    ->map(function ($lines) {
        return LogEntry::fromLines($lines);
    })
    ->each(function (LogEntry $logEntry) {
        // Process the log entry...
    });


或者，想像你需要迭代 10,000 个 `Eloquent` 模型，使用传统 `Laravel` 集合时，所有 10,000 个 `Eloquent` 模型必须同时加载到内存中：

    $users = App\User::all()->filter(function ($user) {
        return $user->id > 500;
    });

然而，从 `Laravel 6.0` 开始，查询构建器的 `cursor`  方法已经更新为返回 `懒集合` 实例。虽然你仍然只能运行单个查询，但是一次只会在内存中保留一个  `Eloquent` 模型。在整个例子中，直到我们真正迭代完每个用户之后，`filter` 回调才会执行，从而大大减少了内存的使用：

    $users = App\User::cursor()->filter(function ($user) {
        return $user->id > 500;
    });

    foreach ($users as $user) {
        echo $user->id;
    }



### Eloquent 子查询增强功能

_Eloquent 子查询增强功能是由  [Jonathan Reinink](https://github.com/reinink) 实现的_。

Laravel 6.0 引入了几个对数据库子查询支持的新增强和改进。例如，假设我们有一个航班 `destinations` 表和一个飞往目的地的 `flights` 表。`flights` 表包含一个`arrived_at` 列，表示航班何时到达目的地。

使用 Laravel 6.0 中新的子查询选择功能，我们可以使用一个查询选择所有的 `destinations` 和最近到达该目的地的航班的名称：

    return Destination::addSelect(['last_flight' => Flight::select('name')
        ->whereColumn('destination_id', 'destinations.id')
        ->orderBy('arrived_at', 'desc')
        ->limit(1)
    ])->get();

并且我们可以使用添加到查询生成器的 `orderBy` 函数中的新子查询功能，根据最后一次航班到达目的地的时间对所有目的地进行排序。同样，这可以在对数据库执行单个查询时完成：

    return Destination::orderByDesc(
        Flight::select('arrived_at')
            ->whereColumn('destination_id', 'destinations.id')
            ->orderBy('arrived_at', 'desc')
            ->limit(1)
    )->get();


### Laravel UI

通常在早期版本的 `Laravel` 中提供的前端脚手架已被提取到 `laravel/ui` Composer 包中。这将允许 UI 脚手架本身可以独立于主框架进行开发和版本化。经过此次更改，默认框架脚手架中已经不存在 `Bootstrap` 或 `Vue` 代码，并且还从框架中提取了 `make:auth` 命令。

你可以通过安装 `laravel/ui` 包并使用 `ui` Artisan 命令安装前端脚手架 ，来恢复前期 `Laravel`  版本中的传统 `Vue` /  `Bootstrap` 脚手架：

    composer require laravel/ui

    php artisan ui vue --auth
