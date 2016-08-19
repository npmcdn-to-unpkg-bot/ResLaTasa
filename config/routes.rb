Rails.application.routes.draw do

  root 'landing#langin_page'
  
  get 'prestatario_alta_page' => 'tasa#prestatario_alta_page'
  get 'uikit' => 'tasa#uikit'
  get 'login' => 'login#login'

  resources :components do

    collection do
      get 'tasa_landing'
      get 'tasa_header'
      get 'tasa_footer'
      get 'tasa_video'
      get 'tasa_aviso_privacy'
      get 'tasa_slider'
      get 'tasa_aviso_animado'
      get 'tasa_navegacion'
      get 'tasa_login'
      get 'tasa_upload_images'
      get 'input_focus'
      get 'tasa_prestatario_alta'
      get 'prestatario_cotizador'
      get 'prestatario_perfil'
      get 'prestatario_domicilio'
      get 'tasa_estado_laboral'
      get 'datos_estado_laboral'
      get 'tasa_comprobante_ingreso'
      get 'tasa_referencias'
      get 'tasa_loading'
      get 'demouikit'
      get 'tasa_inicio_session_prestatario'
      get 'tasa_recuperar_password'
      get 'tasa_recuperar_respuesta'
      get 'tasa_tooltip'
      get 'tasa_aviso_animado_cuenta'
      get 'prestatario_personal_information'
      get 'tasa_preaprovacion'
    end

  end
  
  get 'demo/vacia' => 'demo#vacia'
  get 'demo/show' => 'demo#show'
  
end
