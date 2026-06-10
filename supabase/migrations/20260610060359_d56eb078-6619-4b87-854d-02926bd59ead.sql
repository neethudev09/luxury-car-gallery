UPDATE public.site_settings
SET value = jsonb_build_object(
  'header', jsonb_build_array(
    jsonb_build_object('type','custom','label','Home','url','/'),
    jsonb_build_object('type','custom','label','Inventory','url','/inventory'),
    jsonb_build_object('type','custom','label','Showroom','url','/showroom'),
    jsonb_build_object('type','page','id','4cd9e12a-4aa4-4350-819b-125d34d06115'),
    jsonb_build_object('type','custom','label','Blog','url','/blog'),
    jsonb_build_object('type','page','id','45ed7b98-ce3e-427d-b415-4b721b5d4b20'),
    jsonb_build_object('type','page','id','d2f541c1-1a0c-4712-a016-04136bd96d9a')
  ),
  'footer_explore', jsonb_build_array(
    jsonb_build_object('type','custom','label','Cars For Sale','url','/inventory'),
    jsonb_build_object('type','page','id','4cd9e12a-4aa4-4350-819b-125d34d06115'),
    jsonb_build_object('type','custom','label','Showroom Tour','url','/showroom'),
    jsonb_build_object('type','custom','label','Media Gallery','url','/media'),
    jsonb_build_object('type','custom','label','News & Blog','url','/blog'),
    jsonb_build_object('type','page','id','45ed7b98-ce3e-427d-b415-4b721b5d4b20'),
    jsonb_build_object('type','page','id','d2f541c1-1a0c-4712-a016-04136bd96d9a')
  )
)
WHERE key = 'menu';