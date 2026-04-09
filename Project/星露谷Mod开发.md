# 星露谷 Mod 开发流程记录

## 环境准备

安装 `.NET SDK` ，VSCode 可以安装 `ilspy` 反编译工具插件

```zsh
# 查看可用的 dotnet 版本
brew search dotnet

# 安装 .NET 6 SDK
brew install --cask dotnet-sdk6

# 测试是否安装成功
dotnet --version
```

## 新建一个 Mod

```zsh
# 选择一个工作目录存放所有的星露谷Mod
cd ~/Projects
mkdir stardew-mods
cd stardew-mods

# 新建一个 .NET class library，Target 为 net6.0，项目名设定为 MyFirstMod
dotnet new classlib -n MyFirstMod -f net6.0
cd MyFirstMod

# 添加 Pathoschild 的 ModBuildConfig（自动处理跨平台引用 & 部署流程）
dotnet add package Pathoschild.Stardew.ModBuildConfig --version 4.4.0
```

新建一个 `manifest.json` 和 `ModEntry.cs` 文件，示例如下：

```json
{
  "Name": "MyFirstMod",
  "Author": "蟹老板",
  "Version": "0.0.1",
  "Description": "测试mod",
  "UniqueID": "CrabBoss.MyFirstMod",
  "EntryDll": "MyFirstMod.dll",
  "MinimumApiVersion": "4.0.0",
  "UpdateKeys": []
}
```

## 开始开发 Mod

接下来就是对 `ModEntry.cs` 进行开发，示例如下(打印 Object 和 NPC 位置信息等)：

```cs
using StardewModdingAPI;
using StardewModdingAPI.Events;
using StardewValley;
using StardewValley.Buildings;
using StardewValley.Objects;
using StardewValley.TerrainFeatures;
using System.Collections.Generic;

namespace MyFirstMod
{
    public class ModEntry : Mod
    {
        public override void Entry(IModHelper helper)
        {
            Monitor.Log("===== 蟹老板开发的Mod测试ing =====", LogLevel.Info);
            helper.Events.GameLoop.DayStarted += OnDayStarted;
        }

        private void OnDayStarted(object sender, DayStartedEventArgs e)
        {
            Monitor.Log("===== 游戏世界快照开始 =====", LogLevel.Info);

            foreach (var location in GetAllLocations())
            {
                Monitor.Log($"[Location] {location.NameOrUniqueName}", LogLevel.Info);

                // 遍历 NPC
                foreach (var npc in location.characters)
                {
                    Monitor.Log($"    NPC: {npc.Name} (位置: {npc.Tile.X}, {npc.Tile.Y})", LogLevel.Info);
                }

                // 遍历物品
                foreach (var pair in location.objects.Pairs)
                {
                    var pos = pair.Key;
                    var obj = pair.Value;
                    // obj.isSpawnedObject = true;
                    Monitor.Log($"    物品: {obj.DisplayName} @ ({pos.X}, {pos.Y}) 是否可移动 {obj.isSpawnedObject}", LogLevel.Info);
                }

                // 遍历农作物（如果有）
                // foreach (var tfPair in location.terrainFeatures.Pairs)
                // {
                //     var pos = tfPair.Key;
                //     var tf = tfPair.Value;
                //     if (tf is HoeDirt dirt && dirt.crop != null)
                //     {
                //         Monitor.Log($"    作物: {dirt.crop.indexOfHarvest.Value} @ ({pos.X}, {pos.Y})", LogLevel.Info);
                //     }
                // }
            }

            Monitor.Log("===== 游戏世界快照结束 =====", LogLevel.Info);
        }

        /// <summary>
        /// 获取游戏中所有 Location（包括室内）。
        /// </summary>
        private IEnumerable<GameLocation> GetAllLocations()
        {
            var visited = new HashSet<GameLocation>();
            var queue = new Queue<GameLocation>(Game1.locations);

            while (queue.Count > 0)
            {
                var location = queue.Dequeue();
                if (!visited.Add(location))
                    continue;

                yield return location;

                // 查找室内建筑
                foreach (var building in location.buildings)
                {
                    if (building.indoors.Value != null)
                        queue.Enqueue(building.indoors.Value);
                }
            }
        }
    }
}
```

开发完成之后，进行打包，然后打开游戏进行验证：

```zsh
dotnet build -c Debug
```

## 参考资料

[Modding:Index](https://stardewvalleywiki.com/Modding:Index)

[Stardew Modding Wiki](https://stardewmodding.wiki.gg/)
