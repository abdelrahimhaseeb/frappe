frappe.pages['workspaces-hub'].on_page_load = function(wrapper) {
	const page = frappe.ui.make_app_page({
		parent: wrapper,
		title: __('مساحات العمل'),
		single_column: true
	});

	const $container = $(wrapper).find('.layout-main-section');
	// Hide left sidebar variants and expand content
	['.layout-side-section', '.side-section', '.desk-sidebar', '.standard-sidebar', '.app-sidebar', '.workspace-sidebar']
		.forEach(sel => $(wrapper).find(sel).hide());
	$(wrapper).find('.layout-main-section-wrapper').css({flex: '1 1 100%', maxWidth: '100%'});
	$container.empty();
	$container.append(`
		<div class="workspaces-hub" style="padding:32px;min-height:calc(100vh - 64px);background:linear-gradient(135deg,#b39db4 0%, #9db0c9 40%, #8a95a8 100%);">
			<div class="hub-header" style="color:#fff;margin-bottom:24px;text-align:center;">
				<h2 style="margin:0 0 6px">${__('مساحات العمل')}</h2>
				<div style="opacity:.85">${__('اختر تطبيقاً للمتابعة')}</div>
			</div>
			<div class="hub-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:28px;align-items:start;justify-items:center;"></div>
		</div>
	`);

	const $grid = $container.find('.hub-grid');
	const palette = ['#d06e6e','#d08a6e','#d0b16e','#9eb86b','#65b7a6','#6a9fd0','#8a76d0','#b06ecb','#cc6e94','#d0876e'];
	const pick = (n)=>{let h=0;for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))>>>0;return palette[h%palette.length];};

	frappe.xcall('frappe.desk.desktop.get_workspace_sidebar_items').then(res => {
		const pages = (res && res.pages) || [];
		for (const p of pages) {
			if (!p.public || p.is_hidden) continue;
			const icon = p.icon || 'fa fa-cubes';
			const icon_html = icon.includes(' ')||icon.includes('fa-')||icon.includes('octicon')?`<span class="${icon}"></span>`:`<span class="fa fa-${icon}"></span>`;
			const card = $(`
				<div class="hub-card" role="button" style="cursor:pointer;text-align:center;">
					<div class="odoo-tile" style="--tile-bg:${pick(p.name)}">
						<div class="odoo-icon">${icon_html}</div>
					</div>
					<div class="odoo-label">${frappe.utils.escape_html(p.title||p.name)}</div>
				</div>
			`);
			card.on('click', () => frappe.set_route('workspace', p.name));
			$grid.append(card);
		}
	});
};

frappe.pages['workspaces-hub'].on_page_show = function() {
	try {
		document.body.classList.add('hub-active');
		document.body.setAttribute('data-route','app/page/workspaces-hub');
		['.layout-side-section', '.side-section', '.desk-sidebar', '.standard-sidebar', '.app-sidebar', '.workspace-sidebar']
			.forEach(sel => { const el = document.querySelector(sel); if (el) el.style.setProperty('display','none','important'); });
		const wrap = document.querySelector('.layout-main-section-wrapper');
		if (wrap) { wrap.style.setProperty('max-width','100%','important'); wrap.style.setProperty('flex','1 1 100%','important'); }
	} catch(e){}
};

frappe.pages['workspaces-hub'].on_page_hide = function() {
	try { document.body.classList.remove('hub-active'); } catch(e){}
};
