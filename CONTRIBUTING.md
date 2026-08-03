# Git çalışma sistemi

`main` her zaman yayınlanabilir tutulur. Değişiklikler kısa ömürlü `feat/`, `fix/`, `content/` veya `ops/` dallarında hazırlanır ve pull request ile birleştirilir.

Commitler Conventional Commits biçimini kullanır: `feat:`, `fix:`, `content:`, `perf:`, `security:`, `ci:` ve `chore:`. Zorunlu kalite kontrolleri geçmeden birleştirme yapılmaz. Veritabanı değişiklikleri şema, üretilmiş migration ve geri alma açıklamasını aynı PR içinde taşımalıdır.

Canlı yayın yalnız doğrulanmış commit SHA'sından paketlenir. Acil geri alma, son sağlıklı değiştirilemez Sites sürümünün yeniden yayımlanmasıdır.
