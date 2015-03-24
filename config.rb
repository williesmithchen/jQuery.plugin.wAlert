# Require any additional compass plugins here.
require 'breakpoint'
require 'compass'
require 'susy'

# Dev Mode :development / :production
environment = :development

# Http Setting
http_path = "/"

# Project Setting
project_path = "private/"

# Set this to the root of your project when deployed:
css_dir						=	"css"
css_path					=	"public/css"
http_stylesheets_path		=	"css"

sass_dir					=	"scss"
# sass_path					=	"scss"

images_dir					=	"images"
images_path					=	"public/images"
http_images_path			=	"images"
# generated_images_dir		=	""
# generated_images_path		=	""
# http_generated_images_path=	""

javascripts_dir				=	"js"
javascripts_path			=	"public/js"
http_javascripts_path		=	"js"

fonts_dir					=	"scss/fonts"
fonts_path					=	"public/css/fonts"
#http_fonts_dir				=	""
#http_fonts_path			=	""

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = :compact

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
preferred_syntax = :scss
# and then run:
# sass-convert -R --from scss --to sass  scss && rm -rf sass && mv scss sass
